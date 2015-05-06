var map;
function initialize() {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(48.135324, 11.583721),
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);
