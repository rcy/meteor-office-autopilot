var endpoint = 'https://api.moon-ray.com/cdata.php';

var NonEmptyString = Match.Where(function (x) {
  check(x, String);
  return x.length > 0;
});

OAP = {
  checkConfig: function() {
    if (!this.isConfigured())
      throw new Meteor.Error("OAP not configured");
    return true;
  },
  config: function(options) {
    check(options.appid, NonEmptyString);
    check(options.key, NonEmptyString);
    this.appid = options.appid;
    this.key = options.key;
    console.log('OAP configured with appid:', this.appid, 'key:', this.key);
  },
  isConfigured: function () {
    return (this.appid && this.key) ? true : false;
  },

  ///////////////
  // API WRAPPERS
  ///////////////
  createContact: function(options) {
    this.checkConfig();
    check(options.email, NonEmptyString);
    var response = HTTP.post(endpoint, { params: { appid: this.appid, key: this.key,
                                                   return_id: 1, // XXX what is this?
                                                   reqType: 'add',
                                                   data: '<contact><Group_Tag name="Contact Information"><field name="E-Mail">' + options.email + '</field></Group_Tag></contact>'
                                                 }
                                       });
    var obj = xml2js.parseStringSync(response.content, {explicitArray: true, mergeAttrs: true});
    return obj.result && obj.result.contact && obj.result.contact[0];
  },

  findContactsByEmail: function(email) {
    this.checkConfig();
    check(email, NonEmptyString);
    var response = HTTP.post(endpoint, { params: { appid: this.appid, key: this.key,
                                                   return_id: 1, // XXX what is this?
                                                   reqType: 'search',
                                                   data: '<search><equation><field>E-mail</field><op>e</op><value>'+email+'</value></equation></search>'
                                                 }
                                       });
    var data = xml2js.parseStringSync(response.content, {explicitArray: true, mergeAttrs: true});
    return data && data.result && data.result.contact;
  },

  findContactById: function(id) {
    this.checkConfig();
    var response = HTTP.post(endpoint, { params: { appid: this.appid, key: this.key,
                                                   return_id: 1, // XXX what is this?
                                                   reqType: 'fetch',
                                                   data: '<contact_id>'+id+'</contact_id>'
                                                 }
                                       });

    var data = xml2js.parseStringSync(response.content, {explicitArray: true, mergeAttrs: true});
    return data && data.result && data.result.contact && data.result.contact[0];
  },

  updateContactField: function(id, options) {
    this.checkConfig();
    check(options.group_tag, NonEmptyString);
    check(options.field, NonEmptyString);
    check(options.value, NonEmptyString);

    var response = HTTP.post(endpoint, {params: { appid: this.appid, key: this.key,
                                                  return_id: 1, // XXX what is this?
                                                  reqType: 'update',
                                                  data: '<contact id="'+id+'"><Group_Tag name="'+options.group_tag+'"><field name="'+options.field+'">'+options.value+'</field></Group_Tag></contact>'
                                                }
                                        });

    var obj = xml2js.parseStringSync(response.content, {explicitArray: false, mergeAttrs: true});
    return obj.result;
  },

  updateContactTag: function(id, options) {
    this.checkConfig();
    check(options.tag, NonEmptyString);
    check(options.value, Boolean);

    var response = HTTP.post(endpoint, {params: { appid: this.appid, key: this.key,
                                                  return_id: 1, // XXX what is this?
                                                  reqType: options.value ? 'add_tag' : 'remove_tag',
                                                  data: '<contact id="'+id+'"><tag>'+options.tag+'</tag></contact>'
                                                }
                                        });

    var obj = xml2js.parseStringSync(response.content, {explicitArray: true, mergeAttrs: true});
    return obj.result && obj.result.contact && obj.result.contact[0];
  }

};

// methods for the client to call
Meteor.methods({
  'oap/createContact': function(options) {
    return OAP.createContact(options);
  },
  'oap/findContactById': function(id) {
    return OAP.findContactById(id);
  },
  'oap/findContactsByEmail': function(email) {
    return OAP.findContactsByEmail(email);
  },
  'oap/updateContactField': function(id, options) {
    return OAP.updateContactField(id, options);
  },
  'oap/updateContactTag': function(id, options) {
    return OAP.updateContactTag(id, options);
  }
});
