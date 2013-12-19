Package.describe({
  summary: "Office AutoPilot API"
});

Package.on_use(function(api) {
  api.use(['livedata', 'check', 'underscore', 'http', 'xml2js']);

  api.add_files(['oap.js'], 'server');

  api.export('OAP');
});

Package.on_test(function (api, where) {
  api.use(['tinytest', 'office-autopilot', 'xml2js'], ['client', 'server']);
  api.add_files(['tests.js'], ['client', 'server']);
});
