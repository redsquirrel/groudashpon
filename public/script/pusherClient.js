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
    socket.subscribe(cityName).bind('citySavings', receiveCitySavings(cityName));
  });

  socket.subscribe("deals").bind('purchase', receiveDealUpdates);
}

function receiveCitySavings(cityName) {
  return function(total) {
    var amount = currencyFormat(total); 
    if ($(cityName).innerHTML != amount) {
  		if ($(cityName).innerHTML != "") {
        new Effect.Highlight(cityName, {restorecolor: "#FFFFFF"});
  		}
      $(cityName).update(amount);
      sortList();  
    }
  };
}

function receiveDealUpdates(data) {
  addBlip(data.latitude, data.longitude, data.image, data.url);
  $("firehose").innerHTML = "<a target='_blank' href='" + data.url + "'><img src='" + data.image + "' /></a>" + $("firehose").innerHTML;
}

document.observe("dom:loaded", setupSocketUpdates);

WebSocket.__swfLocation = "/swf/WebSocketMain.swf";
