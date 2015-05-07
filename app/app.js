var config = {
  foursquare: {
    URL: 'https://api.foursquare.com/v2/venues/search',
    CLIENT_ID: 'C0J5BP55MVKSIO5LDPV3DTZQFG0OH3TZCJPZL4C3KLMROETC',
    CLIENT_SECRET: 'IM21TX0DTYM5DZ4ABJ2VABJUJR5U3NVKLGZVSJZMPWQQFM3J',
    API_VERSION: 20130815
  }
};


var map;
function initialize() {
  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(48.773850, 9.176832),
    disableDefaultUI: true
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
}

var infowindow = new google.maps.InfoWindow();

google.maps.event.addDomListener(window, 'load', initialize);


var Location = function(data) {
  var self = this;
  self.name = ko.observable(data.name);
  self.lat = ko.observable(data.lat);
  self.lon = ko.observable(data.lon);
  self.address = ko.observable(data.address);
  self.checkins = ko.observable(data.checkins);
  self.hearts = ko.observable(data.hearts);
  self.marker = new google.maps.Marker({
      position: new google.maps.LatLng(data.lat,data.lon),
      map: map,
      title: data.name,
      animation: google.maps.Animation.DROP
  });

  self.loved = ko.computed(function() {
    return self.hearts() > 5;
  });

  self.focused = ko.observable(false);
  self.setFocused = function() {
    self.focused(true);
    infowindow.setContent(self.name());
    infowindow.open(map, self.marker);
  };

  google.maps.event.addListener(self.marker, 'click', function() {
    self.setFocused();
  });

};

var MapSearch = function() {
  var self = this;
  self.searchString = ko.observable();
  self.loading = ko.observable(false);
  self.search = function() {

    // reset location results
    self.clearLocations();

    // if no searchterm, abort
    if (!self.searchString()) { return; }

    // disable search btn
    self.loading(true);

    $.ajax({
      dataType: "json",
      url: config.foursquare.URL,
      data: {
        client_id: config.foursquare.CLIENT_ID,
        client_secret: config.foursquare.CLIENT_SECRET,
        v: config.foursquare.API_VERSION,
        ll: map.getCenter().toUrlValue(),
        query: self.searchString()
      }
    }).then(function(data) {
      // enable form
      self.loading(false);

      // handle unknown response
      if (!data || !data.response || !data.response.venues) { return; }

      var venues = data.response.venues;
      var length = venues.length;
      for (var i = 0; i < length; i++) {
        var venue = venues[i];
        // our relevant data
        var data = {
          name: venue.name,
          lat: venue.location.lat,
          lon: venue.location.lng,
          address: venue.location.formattedAddress[0],
          checkins: venue.stats.checkinsCount,
          hearts: venue.stats.tipCount
        };

        // only add this if it's a nice result...
        if (data.checkins && data.hearts) {
          self.locations.push(new Location(data));
        }
      }

    }, function(error) {
      alert('my bad...');
    });

    console.log('searching for ' + self.searchString());
  };

  self.locations = ko.observableArray([]);
  self.locationsCount = ko.computed(function() {
    return self.locations().length;
  });
  self.clearLocations = function() {
    var locations = self.locations();
    var length = locations.length;
    for (var i = 0; i < length; i++) {
      locations[i].marker.setMap(null);
    }
    self.locations([]);
  };
  self.clearLocationFocus = function() {
    var locations = self.locations();
    var length = locations.length;
    for (var i = 0; i < length; i++) {
      locations[i].focused(false);
    }
  };
  self.focusLocation = function(location) {
    self.clearLocationFocus();
    location.marker.setAnimation(google.maps.Animation.DROP);
    location.setFocused();
  };

  self.listActive = ko.computed(function() {
    return self.locations().length > 0;
  });

};

ko.applyBindings(new MapSearch());
