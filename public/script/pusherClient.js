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

WebSocket.__swfLocation = "/swf/WebSocketMain.swf";
document.observe("dom:loaded", function() {
  var socket = new Pusher('0aa652d61807ea18fe70');
	$$(".city-data").each(function(cityData) {
		var cityName = cityData.id;
	  socket.subscribe(cityName).bind('update', function(data) {
	    setTimeout(function(){
	      var amount = currencyFormat(data.total); 
	      if ($(cityName).innerHTML != amount) {
					if ($(cityName).innerHTML != "") {
	        	addBlip(data.location.latitude, data.location.longitude);
					}
	        $(cityName).update(amount);
	        sortList();
	        new Effect.Highlight(cityName);
	      }
	    }, Math.random()*15000);
	  });  
		
	})

});
