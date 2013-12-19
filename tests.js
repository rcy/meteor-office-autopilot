var base = 'OfficeAutoPilot - ';

if (Meteor.isServer) {
  Tinytest.add(base+'check exports', function (test) {
    test.equal(typeof OAP, 'object');
  });

  Tinytest.add(base+'bad config', function (test) {
    test.throws(function () {
      OAP.config();
    });
  });

  Tinytest.add(base+'good config', function (test) {
    // note, no checking of valid keys is done here
    OAP.config({appid: 'theappid', key: 'thekey'});
  });

  Tinytest.add(base+'Meteor.settings.oap_config', function (test) {
    console.error(Meteor.settings);
    test.equal(typeof Meteor._get(Meteor.settings, 'oap_config', 'appid'), 'string', "*** Run with meteor --settings oap_config.json ***");
    test.equal(typeof Meteor._get(Meteor.settings, 'oap_config', 'key'), 'string', "*** Run with meteor --settings oap_config.json ***");
  });

  Tinytest.add(base+'api call without config', function (test) {
    OAP.appid = null;
    OAP.key = null;
    var result = OAP.findContactsByEmail('rcyeske@gmail.com');
    test.equal(result, null);
  });

  Tinytest.add(base+'find contact by email', function (test) {
    OAP.config(Meteor.settings.oap_config);
    var result = OAP.findContactsByEmail('rcyeske@gmail.com');
    test.equal(result[0].id, '4528');
  });

  Tinytest.add(base+'find contact by id', function (test) {
    OAP.config(Meteor.settings.oap_config);
    var result = OAP.findContactById('4528');
    test.equal(result.purl, 'RyanY');
  });

  Tinytest.add(base+'updateContactField', function (test) {
    OAP.config(Meteor.settings.oap_config);
    var result = OAP.updateContactField('4528', {group_tag: 'Contact Information', field: 'Revenue Goal', value: '10000'});
    var revenue = _(_(result.contact['Group_Tag']).where({name: 'Contact Information'})[0].field).where({name: 'Revenue Goal'})[0]._;
    test.equal(revenue, '10000');
  });

  Tinytest.add(base+'updateContactTag', function (test) {
    OAP.config(Meteor.settings.oap_config);
    var result = OAP.updateContactTag('4528', {tag: 'FizzBuzz', value: true});
    test.equal(result.status, 'success');
    test.equal(result.tag[0].status, 'success');
    result = OAP.updateContactTag('4528', {tag: 'FizzBuzz', value: false});
    test.equal(result.status, 'success');
    test.equal(result.tag[0].status, 'success');
  });
}
