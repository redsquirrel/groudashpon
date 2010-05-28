var sys = require('sys'),
   http = require('http'),
 crypto = require('crypto');

var domain = 'api.pusherapp.com';

exports.create = function(options) {
  return {
    trigger: function(channel, data, callback) {
      var jsonData = JSON.stringify(data);
      var client = http.createClient(80, domain);
      var uri = '/apps/' + options.appId + '/channels/' + channel + '/events';
      var timestamp = parseInt(new Date().getTime() / 1000);
      var bodyDigest = crypto.createHash('md5').update(jsonData).digest("hex");
      var queryString = 'auth_key=' + options.key +
                        '&auth_timestamp=' + timestamp +
                        '&auth_version=1.0' +
                        '&body_md5=' + bodyDigest +
                        '&name=update';
      var signature = sign(uri, queryString, options.secret);
      var requestPath = uri + '?' + queryString + '&auth_signature=' + signature;
      var request = client.request('POST', requestPath, {
        'host': domain,
        'Content-Type': 'application/json',
        'Content-Length': jsonData.length
      });
      request.write(jsonData);
      if (callback)
        callback(request);
      request.end();
    }
  };
}

function sign(uri, queryString, secret) {
  var signData = 'POST\n'+uri+'\n'+queryString;
  return crypto.createHmac('sha256', secret).update(signData).digest('hex');
}
