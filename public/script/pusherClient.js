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
  addToFirehose(data);
}

function addToFirehose(data) {
  var image = new Image();
  image.setAttribute("src", data.image);
  
  var link = document.createElement('a');
  link.setAttribute("target", "_blank");
  link.setAttribute("href", data.url);
  link.appendChild(image);
  
  var firehose = $("firehose");
  var elements = firehose.childElements();
  if (elements.length > 0) {
    firehose.insertBefore(link, elements[0]);
    if (elements.length > 50) {
      firehose.removeChild(elements[elements.length-1]);
    }
  } else {
    firehose.appendChild(link);
  }
}

document.observe("dom:loaded", setupSocketUpdates);

WebSocket.__swfLocation = "/swf/WebSocketMain.swf";
