var myMap;

document.observe("dom:loaded", function() {
  var myOptions = {
    zoom: 4,
    center: new google.maps.LatLng(38.16,-95.72),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    navigationControl: false,
    mapTypeControl: false
  }
  myMap = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);	
});

function addBlip(lat, lng, image, url) {
  var blip = new google.maps.MarkerImage(image,
      new google.maps.Size(100, 61),  //size
      new google.maps.Point(0,0),     //origin
      new google.maps.Point(25, 40)); //anchor
  
  var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: myMap,
      icon: blip,
      clickable: true
  });
  
  google.maps.event.addListener(marker, 'click', function() {
    window.open(url, "_blank").focus();
  });
  
  setTimeout(function(){ marker.setMap(null); }, 3000);
}