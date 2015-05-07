console.log('hello world');

// var initialData = [
//     { name: "Well-Travelled Kitten", sales: 352, price: 75.95 },
//     { name: "Speedy Coyote", sales: 89, price: 190.00 },
//     { name: "Furious Lizard", sales: 152, price: 25.00 },
//     { name: "Indifferent Monkey", sales: 1, price: 99.95 },
//     { name: "Brooding Dragon", sales: 0, price: 6350 },
//     { name: "Ingenious Tadpole", sales: 39450, price: 0.35 },
//     { name: "Optimistic Snail", sales: 420, price: 1.50 }
// ];



// https://api.foursquare.com/v2/venues/search
//   ?client_id=C0J5BP55MVKSIO5LDPV3DTZQFG0OH3TZCJPZL4C3KLMROETC
//   &client_secret=IM21TX0DTYM5DZ4ABJ2VABJUJR5U3NVKLGZVSJZMPWQQFM3J
//   &v=20130815
//   &ll=40.7,-74
//   &query=sushi

var config = {
  foursquare: {
    URL: 'https://api.foursquare.com/v2/venues/search',
    CLIENT_ID: 'C0J5BP55MVKSIO5LDPV3DTZQFG0OH3TZCJPZL4C3KLMROETC',
    CLIENT_SECRET: 'IM21TX0DTYM5DZ4ABJ2VABJUJR5U3NVKLGZVSJZMPWQQFM3J',
    API_VERSION: 20130815
  }
};


// what models?
// - Searchbar / MapSearch
// - Location

var Location = function(data) {
  var self = this;
  self.name = ko.observable(data.name);
  self.lat = ko.observable(data.lat);
  self.lon = ko.observable(data.lon);
};

var MapSearch = function() {
  var self = this;
  self.searchString = ko.observable();
  self.loading = ko.observable(false);
  self.search = function() {
    // disable search btn
    self.loading(true);

    // reset location results
    self.locations([]);

    $.ajax({
      dataType: "json",
      url: config.foursquare.URL,
      data: {
        client_id: config.foursquare.CLIENT_ID,
        client_secret: config.foursquare.CLIENT_SECRET,
        v: config.foursquare.API_VERSION,
        ll: "48.773850,9.176832",
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
          lon: venue.location.lng
        };
        self.locations.push(new Location(data));
      }
      console.log(self.locations()[0].name());

    }, function(error) {
      alert('my bad...');
    });

    console.log('searching for ' + self.searchString());
  };

  self.locations = ko.observableArray([]);
  self.locationsCount = ko.computed(function() {
    return self.locations().length;
  });

  self.listActive = ko.computed(function() {
    return self.locations().length > 0;
  });


};

ko.applyBindings(new MapSearch());
