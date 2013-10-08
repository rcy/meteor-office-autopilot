Package.describe({
  summary: "Office AutoPilot API"
});

Package.on_use(function(api) {
  api.use(['livedata', 'check', 'underscore', 'http', 'xml2js']);

  api.add_files(['oap.js'], 'server');

  api.export('OAP');
});
