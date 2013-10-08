var endpoint = 'https://api.moon-ray.com/cdata.php';

OAP = {
  checkConfig: function() {
    if (!this.appid || !this.key)
      throw new Meteor.Error("OAP not configured");
    return true;
  },
  config: function(options) {
    check(options.appid, String);
    check(options.key, String);
    this.appid = options.appid;
    this.key = options.key;
  },

  ///////////////
  // API WRAPPERS
  ///////////////
  createContact: function(options) {
    this.checkConfig();
    check(options.email, String);
    var response = HTTP.post(endpoint, { params: { appid: this.appid, key: this.key,
                                                   return_id: 1, // XXX what is this?
                                                   reqType: 'add',
                                                   data: '<contact><Group_Tag name="Contact Information"><field name="E-Mail">' + options.email + '</field></Group_Tag></contact>'
                                                 }
                                       });
    return xml2js.parseStringSync(response.content, {explicitArray: true, mergeAttrs: true});
  },

  findContactsByEmail: function(email) {
    this.checkConfig();
    check(email, String);
    var response = HTTP.post(endpoint, { params: { appid: this.appid, key: this.key,
                                                   return_id: 1, // XXX what is this?
                                                   reqType: 'search',
                                                   data: '<search><equation><field>E-mail</field><op>e</op><value>'+email+'</value></equation></search>'
                                                 }
                                       });
    return xml2js.parseStringSync(response.content, {explicitArray: true, mergeAttrs: true});
  },

  findContactById: function(id) {
    this.checkConfig();
    var response = HTTP.post(endpoint, { params: { appid: this.appid, key: this.key,
                                                   return_id: 1, // XXX what is this?
                                                   reqType: 'fetch',
                                                   data: '<contact_id>'+id+'</contact_id>'
                                                 }
                                       });
    return xml2js.parseStringSync(response.content, {explicitArray: true, mergeAttrs: true});
  },

  updateContactField: function(id, options) {
    console.log('updateContactField', id, options);
    check(options.group_tag, String);
    check(options.field, String);
    check(options.value, String);

    var response = HTTP.post(endpoint, {params: { appid: this.appid, key: this.key,
                                                  return_id: 1, // XXX what is this?
                                                  reqType: 'update',
                                                  data: '<contact id="'+id+'"><Group_Tag name="'+options.group_tag+'"><field name="'+options.field+'">'+options.value+'</field></Group_Tag></contact>'
                                                }
                                        });
    console.log('response:', response);
    return xml2js.parseStringSync(response.content, {explicitArray: true, mergeAttrs: true});
  },

  updateContactTag: function(id, options) {
    console.log('updateContactTag', id, options);
    check(options.tag, String);
    check(options.value, Boolean);

    var response = HTTP.post(endpoint, {params: { appid: this.appid, key: this.key,
                                                  return_id: 1, // XXX what is this?
                                                  reqType: options.value ? 'add_tag' : 'remove_tag',
                                                  data: '<contact id="'+id+'"><tag>'+options.tag+'</tag></contact>'
                                                }
                                        });

    return xml2js.parseStringSync(response.content, {explicitArray: true, mergeAttrs: true});
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
