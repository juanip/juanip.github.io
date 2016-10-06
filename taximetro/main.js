var rendererOptions = {
  draggable: true
};
var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
var directionsService = new google.maps.DirectionsService();
var map;

var rosario = new google.maps.LatLng(-32.9558234, -60.6722695);

function initialize() {

  var mapOptions = {
    zoom: 7,
    center: rosario
  };
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  directionsDisplay.setMap(map);

  google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
    computeTotalDistance(directionsDisplay.getDirections());
  });

  calcRoute();
}

function calcRoute() {

  var request = {
    origin: '-32.9486931,-60.6330469',
    destination: '-32.9420665,-60.679095',
    waypoints:[],
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

function computeTotalDistance(result) {
  var distancia = 0;
  var tiempo = 0;
  var tarifa = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    distancia += myroute.legs[i].distance.value;
    tiempo += myroute.legs[i].duration.value;
  }

  tarifa = BAJADA_BANDERA;
  tarifa += (distancia / 100) * FICHA;
  tarifa += (tiempo / 60) * MIN_ESPERA;
  tarifa = tarifa.toFixed(2);
  tarifa += ' ';
  tarifa = tarifa.replace(".",",");

  distancia = distancia / 1000.0;
  distancia = distancia.toFixed(2);
  distancia = distancia + ' ';
  distancia = distancia.replace(".",",");

  tiempo = Math.round(tiempo/60);
  document.getElementById('distancia').innerHTML = distancia + ' km';
  document.getElementById('tiempo').innerHTML = tiempo + ' minutos';
  document.getElementById('tarifa').innerHTML = '$' + tarifa;
}

google.maps.event.addDomListener(window, 'load', initialize);
