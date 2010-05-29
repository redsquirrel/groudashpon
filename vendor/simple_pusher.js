var crypto = require('crypto');
var http = require('http');
var sys = require('sys');

var domain = 'api.pusherapp.com';

exports.trigger = function(config, channel, data, callback) {
  var jsonData = JSON.stringify(data);
  var request = buildRequest(config, jsonData, channel);
  request.write(jsonData);
  if (callback) callback(request);
  request.end();
}

function buildRequest(config, data, channel) {
  var requestPath = buildRequestPath(config, data, channel);
  var client = http.createClient(80, domain);
  return client.request('POST', requestPath, {
    'host': domain,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  });
}

function buildRequestPath(config, data, channel) {
  var queryString = buildQueryString(config.key, data);
  var uri = '/apps/' + config.appId + '/channels/' + channel + '/events';
  var signature = sign(uri, queryString, config.secret);
  return uri + '?' + queryString + '&auth_signature=' + signature;
}

function hash(data) {
  return crypto.createHash('md5').update(data).digest("hex");
}

function buildQueryString(key, data) {
  var bodyHash = hash(data);
  var timestamp = parseInt(new Date().getTime() / 1000);
  return 'auth_key=' + key +
    '&auth_timestamp=' + timestamp +
    '&auth_version=1.0' +
    '&body_md5=' + bodyHash +
    '&name=update';
}

function sign(uri, queryString, secret) {
  var signData = 'POST\n' + uri + '\n' + queryString;
  return crypto.createHmac('sha256', secret).update(signData).digest('hex');
}
