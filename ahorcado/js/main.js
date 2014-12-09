var gui;

// main
function init() {
  palabras = new Palabras(lista_palabras);

  if(localStorage.getItem('datos_jugador') != undefined) {
    datos_jugador = JSON.parse(localStorage.getItem('datos_jugador'));
  }
  else {
    datos_jugador = {
      'nombre_jugador': 'Anonimo',
      'nivel' : '1',
      'puntos' : '0',
      'partidas' : '0',
      'aciertos' : '0',
      'errores' : '0'
    };

    localStorage.setItem('datos_jugador', JSON.stringify(datos_jugador));
  }

  jugador = new Jugador(datos_jugador);

  gui = new GUI(palabras, jugador);

  gui.nuevo_juego();

  //inicializar tooltips
  $('[data-toggle="tooltip"]').tooltip();
}