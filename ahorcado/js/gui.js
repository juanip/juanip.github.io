function GUI(palabras, jugador) {
  var palabras = palabras;
  var jugador = jugador;
  var juego;

  var ctrl_intentos = document.querySelector("#intentos");
  var ctrl_progreso = document.querySelector("#progreso");
  var ctrl_letra = document.querySelector("#letra");
  var alert_victoria = document.querySelector("#victoria");
  var alert_derrota = document.querySelector("#derrota");
  var alert_borrar = document.querySelector('#alerta-borrar');
  var alert_nombre = document.querySelector('#alerta-nombre');
  var puntos_victoria = document.querySelector("#puntos-victoria"); 
  var puntos_derrota = document.querySelector("#puntos-derrota");

  var ctrl_nombre_usuario = document.querySelector("#nombre-usuario");
  ctrl_nombre_usuario.innerHTML = jugador.get_nombre_jugador();

  var ctrl_nivel_usuario = document.querySelector("#nivel-usuario");
  var ctrl_puntos_usuario = document.querySelector("#puntos-usuario");
  var ctrl_proximo_nivel = document.querySelector("#proximo-nivel");
  var ctrl_partidas_usuario = document.querySelector("#partidas-usuario");  
  var ctrl_aciertos_usuario = document.querySelector("#aciertos-usuario");  
  var ctrl_errores_usuario = document.querySelector("#errores-usuario");

  this.actualizar_datos = function() {
    ctrl_nivel_usuario.innerHTML = jugador.get_nivel();
    ctrl_puntos_usuario.innerHTML = jugador.get_puntos();
    ctrl_proximo_nivel.innerHTML = jugador.get_puntos_proximo_nivel();
    ctrl_partidas_usuario.innerHTML = jugador.get_partidas();
    ctrl_aciertos_usuario.innerHTML = jugador.get_aciertos();
    ctrl_errores_usuario.innerHTML = jugador.get_errores();
  };

  this.actualizar_datos();

  var ctrl_usuario = document.querySelector("#usuario");

  var ctrl_imagenes = [];
  for(i = 0; i < 7; i++) {
    ctrl_imagenes[i] = document.querySelector("#img" + i);
  }

  this.set_intentos = function(intentos) {
    ctrl_intentos.innerHTML = intentos;
  };

  this.set_progreso = function(progreso) {
    ctrl_progreso.innerHTML = progreso;
  };

  this.dibujar_ahorcado = function(vidas) {
    switch(vidas) {
      case 0: ctrl_imagenes[5].style.display = "block"; 
      case 1: ctrl_imagenes[4].style.display = "block"; 
      case 2: ctrl_imagenes[3].style.display = "block"; 
      case 3: ctrl_imagenes[2].style.display = "block"; 
      case 4: ctrl_imagenes[1].style.display = "block"; 
      case 5: ctrl_imagenes[0].style.display = "block"; 
    }
  }

  this.nuevo_juego = function() {
    juego = new Juego(palabras.get_palabra());

    this.set_intentos(juego.get_intentos());
    this.set_progreso(juego.get_progreso());

    for(i = 0; i < 6; i++) {
      ctrl_imagenes[i].style.display = "none";
    }

    this.borrar_alertas();
    ctrl_letra.focus();
  };

  this.terminar_juego = function() {
    puntos = juego.terminar_juego();
    jugador.add_puntos(puntos);
    jugador.sumar_partida();
    jugador.set_nivel();

    datos_jugador = jugador.get_datos();

    localStorage.setItem('datos_jugador', JSON.stringify(datos_jugador));

    this.actualizar_datos();

    if(puntos > 0) {
      puntos_victoria.innerHTML = puntos;
      alert_victoria.style.display = "block";
    }
    else {
      puntos_derrota.innerHTML = puntos;
      alert_derrota.style.display = "block";
    }
  }

  this.jugar_letra = function() {
    if(!juego.get_juego_finalizado()) {
      letra = ctrl_letra.value[0];      
  
      resultados = juego.probar_letra(letra);
  
      jugador.sumar_error(resultados['errores']);
      jugador.sumar_acierto(resultados['aciertos']);

      this.dibujar_ahorcado(juego.get_vidas());
  
      if(juego.get_vidas() < 1 || juego.get_restantes() < 1) {
        this.terminar_juego();
      }
      
      this.set_intentos(juego.get_intentos());
      this.set_progreso(juego.get_progreso());
      
    }

    ctrl_letra.value = "";
    ctrl_letra.focus();

  };

  this.pulsa_tecla = function(tecla) {
    switch(tecla.keyCode){
      //enter
      case 13: 
        this.jugar_letra(); 
        break;
      //flecha arriba
      case 38:
        this.nuevo_juego();
        break;
      //flecha izquierda 37
      //flecha derecha 39
      //flecha abajo 40
    }
  };

  this.cambiar_nombre = function(accion) {
    if(accion) {
      nombre = ctrl_usuario.value;
      if(nombre != '') {
        jugador.set_nombre_jugador(nombre);
        datos_jugador = jugador.get_datos();
        localStorage.setItem('datos_jugador', JSON.stringify(datos_jugador));
  
        ctrl_nombre_usuario.innerHTML = nombre;
      }

    this.borrar_alertas();
    alert_nombre.style.display = "block";
    }

    ctrl_usuario.value = "";
  };

  this.borrar_datos = function() {
    datos_jugador = {
      'nombre_jugador': 'Anonimo',
      'nivel' : '1',
      'puntos' : '0',
      'partidas' : '0',
      'aciertos' : '0',
      'errores' : '0'
    };
    jugador = new Jugador(datos_jugador);

    localStorage.setItem('datos_jugador', JSON.stringify(datos_jugador));
  
    ctrl_nombre_usuario.innerHTML = jugador.get_nombre_jugador();
    this.actualizar_datos();
    
    this.borrar_alertas();
    alert_borrar.style.display = "block";
  };

  this.borrar_alertas = function() {
    alert_victoria.style.display = "none";
    alert_derrota.style.display = "none";
    alert_borrar.style.display = "none";
    alert_nombre.style.display = "none";
  }
}