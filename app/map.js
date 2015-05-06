var map;
function initialize() {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(48.773850, 9.176832),
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);
