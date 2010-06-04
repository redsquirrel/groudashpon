var list = {};
function cityData(element) {
  var city = element.id.replace("-item", "");
  var amount = city && unformat($(city).innerHTML);
  return amount || 0;
}

function sortNumber(a, b) {
  return cityData(b) - cityData(a);
}

function sortList() {
  var sortedCities = $("cities").childElements().sort(sortNumber);
  $("cities").innerHTML = "";
  sortedCities.each(function(city) {
    $("cities").appendChild(city);
  });
}

function currencyFormat(amount) {
  var amountWithCommas = new String(amount);
  var regex = /(\d+)(\d{3})/;
  while (regex.test(amountWithCommas))
    amountWithCommas = amountWithCommas.replace(regex, '$1' + ',' + '$2');
  return "$" + amountWithCommas;
}

function unformat(formattedAmount) {
  return formattedAmount.replace(/,|\$/g, "");
}

function setupSocketUpdates() {
  var socket = new Pusher('0aa652d61807ea18fe70');
	$$(".city-data").each(function(cityData) {
		var cityName = cityData.id;
	  socket.subscribe(cityName).bind('update', receiveSocketUpdates(cityName));
	});
}

function receiveSocketUpdates(cityName) {
  return function(data) {
    var amount = currencyFormat(data.total); 
    if ($(cityName).innerHTML != amount) {
  		if ($(cityName).innerHTML == "") {
  		  handleUpdate(cityName, amount);
  		} else {
        setTimeout(function() {
        	addBlip(data.location.latitude, data.location.longitude);
          new Effect.Highlight(cityName, {restorecolor: "#FFFFFF"});
    		  handleUpdate(cityName, amount);
        }, Math.random()*15000);
  		}
    }
  };
}

function handleUpdate(cityName, amount) {
  $(cityName).update(amount);
  sortList();  
}

document.observe("dom:loaded", setupSocketUpdates);

WebSocket.__swfLocation = "/swf/WebSocketMain.swf";
