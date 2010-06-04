document.observe("dom:loaded", function() {
  var myOptions = {
    zoom: 4,
    center: new google.maps.LatLng(38.16,-95.72),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    navigationControl: false,
    mapTypeControl: false
  }
  myMap = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);
  myGeocoder = new google.maps.Geocoder();
	
});

function addBlip(lat, lng) {
  var blip = new google.maps.MarkerImage('images/blip.gif',
      new google.maps.Size(70, 80),   //size
      new google.maps.Point(0,0),     //origin
      new google.maps.Point(25, 40)); //anchor
  
  var marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      map: myMap,
      icon: blip,
  });
  
  setTimeout(function(){ marker.setVisible(false); }, 2500);
}