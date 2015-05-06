function Map (node) {
  canvas = node;

  mapOptions = {
    center: new google.maps.LatLng(-32.9471803,-60.6343154),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  map = new google.maps.Map(canvas, mapOptions);

  directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);

  directionsService = new google.maps.DirectionsService();
  
  request = {
    origin: "",
    destination: "",
    waypoints: [],
    provideRouteAlternatives: false,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    optimizeWaypoints: true
  }

  this.setOrigin = function (origin) {
    request.origin = origin;
  }

  this.setDestination = function (destination) {
    request.destination = destination;
  }

  this.addWaypoint = function (location, stopover) {
    waypoint = {
      location: location,
      stopover: stopover
    }

    request.waypoints.push(waypoint);
  }

  this.getRoute = function () {
    directionsService.route(request, function (result, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(result);
      }
    })
  }

}