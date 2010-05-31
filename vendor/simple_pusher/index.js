var crypto = require('crypto');
var http = require('http');
var sys = require('sys');

var domain = 'api.pusherapp.com';

exports.trigger = function(config, channel, eventName, data, callback) {
  var jsonData = JSON.stringify(data);
  var request = buildRequest(config, channel, eventName, jsonData);
  request.write(jsonData);
  if (callback) callback(request);
  request.end();
}

function buildRequest(config, channel, eventName, data) {
  var requestPath = buildRequestPath(config, channel, eventName, data);
  var client = http.createClient(80, domain);
  client.addListener('error', function(error) {
    sys.error("Client error: " + error);
  })
  return client.request('POST', requestPath, {
    'host': domain,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  });
}

function buildRequestPath(config, channel, eventName, data) {
  var queryString = buildQueryString(config.key, eventName, data);
  var uri = '/apps/' + config.appId + '/channels/' + channel + '/events';
  var signature = sign(uri, queryString, config.secret);
  return uri + '?' + queryString + '&auth_signature=' + signature;
}

function buildQueryString(key, eventName, data) {
  var timestamp = parseInt(new Date().getTime() / 1000);
  return 'auth_key=' + key +
    '&auth_timestamp=' + timestamp +
    '&auth_version=1.0' +
    '&body_md5=' + hash(data) +
    '&name=' + eventName;
}

function hash(data) {
  return crypto.createHash('md5').update(data).digest("hex");
}

function sign(uri, queryString, secret) {
  var signData = 'POST\n' + uri + '\n' + queryString;
  return crypto.createHmac('sha256', secret).update(signData).digest('hex');
}