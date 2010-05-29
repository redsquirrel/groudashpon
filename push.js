var http = require('http');
var pusher = require('./pusher');
var sys = require('sys');

var domain = 'www.groupon.com';
var dealsPath = '/api/v1/deals.json';
var divisionsPath = '/api/v1/divisions.json';

(function loop() {
  sys.puts("Looping");

  setTimeout(loop, 10000);
  try {
    var groupon = http.createClient(80, domain);
    var divisionsRequest = groupon.request('GET', divisionsPath, {host: domain});
    divisionsRequest.addListener('response', responseHandler(processDivisions));
    divisionsRequest.end();
  } catch (e) {
    sys.puts("Error in loop(): " + sys.inspect(e));
  }
})();

function processDivisions(divisionsData) {
  try {
    var divisions = JSON.parse(divisionsData)['divisions'];

    divisions.forEach(function(division) {
      var path = dealsPath + '?' +
        'lat=' + division['location']['latitude'] +
        '&lng=' + division['location']['longitude'];

      var groupon = http.createClient(80, domain);
      var dealsRequest = groupon.request('GET', path, {host: domain});
      dealsRequest.addListener('response', responseHandler(processDeals(division['id'])));
      dealsRequest.end();    
    });
  } catch (e) {
    sys.puts("Error in processDivisions(): " + sys.inspect(e));
  }
}

function processDeals(division) {
  return function(dealsData) {
    try {
      var deals = JSON.parse(dealsData)['deals'];
      var total = 0;
      deals.forEach(function(deal) {
        if (deal['tipped']) {
          total += parseInt(deal['quantity_sold']) * parseFloat(deal['price']);
        }
      });    
      pusher.trigger(division, total);      
    } catch (e) {
      sys.puts("Error in processDeals(): " + sys.inspect(e));
    }
  }
}

function responseHandler(callback) {
  return function(response) {
    try {
      var responseBody = "";  
      response.setEncoding('utf8');
      response.addListener('data', function(chunk) {
        responseBody += chunk;
      });
      response.addListener('end', function() {
        callback(responseBody);
      });
    } catch (e) {
      sys.puts("Error in responseHandler() " + sys.inspect(e));
    }
  }
}