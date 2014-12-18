var Jugador = function(datos) {
  var nombre = datos['nombre_jugador'];
  var nivel = parseInt(datos['nivel']);
  var puntos = parseInt(datos['puntos']);
  var partidas = parseInt(datos['partidas']);
  var aciertos = parseInt(datos['aciertos']);
  var errores = parseInt(datos['errores']);

  var tabla_niveles = {
    '1' :  0,
    '2' :  100,
    '3' :  250,
    '4' :  365,
    '5' :  574,
    '6' :  892,
    '7' :  1389,
    '8' :  2162,
    '9' :  3366,
    '10' : 5240,
    '11' : 8158,
    '12' : 12701,
    '13' : 19774,
    '14' : 30786,
    '15' : 47931,
    '16' : 74624,
    '17' : 116183,
    '18' : 180887,
    '19' : 281626,
    '20' : 420000
  };

  this.get_puntos = function() {
    return puntos;
  };

  this.borrar_puntos = function() {
    puntos = 0;
  }

  this.add_puntos = function(x) {
    puntos += x;
  };

  this.get_nombre_jugador = function() {
    return nombre;
  };

  this.set_nombre_jugador = function(nombre_jugador) {
    nombre = nombre_jugador;
  };

  this.sumar_partida = function() {
    partidas++;
  };

  this.get_partidas = function() {
    return partidas;
  };

  this.sumar_acierto = function(cant) {
    aciertos += cant;
  };

  this.get_aciertos = function() {
    return aciertos;
  };
  
  this.sumar_error = function(cant) {
    errores += cant;
  };

  this.get_errores = function() {
    return errores;
  };

  this.set_nivel = function() {
    if(this.get_puntos() > tabla_niveles[this.get_nivel() + 1]) {
      nivel++;
      return true;
    }
    return false;
  };

  this.get_nivel = function() {
    return nivel;
  };

  this.get_puntos_proximo_nivel = function() {
    if(this.get_nivel() == 20) {
      proximo_nivel = '-';
    }
    else {
      proximo_nivel = tabla_niveles[this.get_nivel() + 1];
    }
    return proximo_nivel;
  }

  this.get_datos = function() {
    datos = {};
    datos['nombre_jugador'] = this.get_nombre_jugador();
    datos['nivel'] = this.get_nivel();
    datos['puntos'] = this.get_puntos();
    datos['partidas'] = partidas;
    datos['aciertos'] = aciertos;
    datos['errores'] = errores;

    return datos;
  };
}