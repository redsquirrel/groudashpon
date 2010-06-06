var http = require('http');
var pusher_config = require('./pusher_config').get();
var simple_pusher = require('./vendor/simple_pusher');
var sys = require('sys');

var domain = 'www.groupon.com';
var dealsPath = '/api/v1/deals.json';
var divisionsPath = '/api/v1/divisions.json';

var dealDatabase = {};

(function loop() {
  sys.puts("Looping");

  setTimeout(loop, 10000);
  try {
    var divisionsRequest = createClient().request('GET', divisionsPath, {host: domain});
    divisionsRequest.addListener('response', responseHandler(processDivisions));
    divisionsRequest.end();
  } catch (e) {
    sys.puts("Error in loop(): " + sys.inspect(e));
  }
})();

function processDivisions(divisionsData) {
  try {
    var divisions = JSON.parse(divisionsData).divisions;

    divisions.forEach(function(division) {
      var path = dealsPath + '?' +
        'lat=' + division.location.latitude +
        '&lng=' + division.location.longitude;

      var dealsRequest = createClient().request('GET', path, {host: domain});
      dealsRequest.addListener('response', responseHandler(processDeals(division)));
      dealsRequest.end();    
    });
  } catch (e) {
    sys.puts("Error in processDivisions(): " + sys.inspect(e));
  }
}

function processDeals(division) {
  return function(dealsData) {
    try {
      var deals = JSON.parse(dealsData).deals;
    } catch (e) {
      sys.puts("Error parsing JSON in processDeals("+division.id+")");
      return;
    }
    pushDivisionTotal(division, deals);
    pushDealUpdates(deals);
  }
}

function pushDivisionTotal(division, deals) {
  try {
    var total = 0;
    deals.forEach(function(deal) {
      if (deal.tipped) {
        total += parseInt(deal.quantity_sold) * parseFloat(deal.discount_amount);
      }
    });
    simple_pusher.trigger(pusher_config, division.id, 'citySavings', total);
  } catch (e) {
    sys.puts("Error in pushDivisionTotal(): " + sys.inspect(e));
  }
}

function pushDealUpdates(deals) {
  try {
    deals.forEach(function(deal) {
      if (dealDatabase[deal.id]) {      
        var justPurchased = parseInt(deal.quantity_sold) - dealDatabase[deal.id];
        // Push an event for *every* new deal purhcased
        for (var i = 0; i < justPurchased; i++) {
          var pushData = {
            latitude: deal.division_lat,
            longitude: deal.division_lng,
            image: deal.medium_image_url,
            url: deal.deal_url
          }
          setTimeout(function() {
            simple_pusher.trigger(pusher_config, 'deals', 'purchase', pushData);
          }, Math.random() * 10000);
        }
      }
      dealDatabase[deal.id] = parseInt(deal.quantity_sold);
    });
  } catch (e) {
    sys.puts("Error in pushDealUpdates(): " + sys.inspect(e));
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

function createClient() {
  var client = http.createClient(80, domain);
  client.addListener('error', function(error) {
    sys.puts("Client error: " + error);
  });
  return client;
}