// Clase Palabras
var Palabras = function(lista) {
  var lista = lista.split(" ");
  
  this.get_cantidad = function() {
    return lista.length;
  };

  this.get_palabra = function() {
    rand = Math.floor(Math.random()*this.get_cantidad());
    return lista[rand];
  };
}


// Clase Jugador
var Jugador = function(nombre_jugador, puntos) {
  var nombre = nombre_jugador;
  var puntos = puntos;

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
  
}


// Clase Juego
var Juego = function(palabra) {
  var palabra_objetivo = palabra;
  var intentos = "";
  var progreso = "";
  var restantes = palabra_objetivo.length;
  var vidas = 6;
  var puntos = 0;
  var puntos_sumar = 15;
  var puntos_restar = 5;

  for(cont = 0; cont < palabra_objetivo.length; cont++) {
    progreso += "_";
  }

  this.sub_vida = function() {
    vidas--;
  };

  this.get_vidas = function() {
    return vidas;
  };

  this.get_intentos = function() {
    return intentos;
  };

  this.set_intentos = function(letra) {
    intentos += letra;
  }

  this.get_progreso = function() {
    return progreso;
  };

  this.set_progreso = function(letra, posicion) {
    progreso = progreso.substr(0,posicion) + letra + progreso.substr(posicion+1);
  };

  this.get_restantes = function() {
    return restantes;
  };
  
  this.sumar_puntos = function() {
    puntos += puntos_sumar;
  }
  this.restar_puntos = function() {
    puntos -= puntos_restar;
  }

  this.probar_letra = function(letra) {
    valida = letra.match(/[A-Z]/i) || letra == "ñ" ? true : false;

    if(valida && intentos.indexOf(letra) == -1 && vidas > 0) {
      this.set_intentos(letra);

      exito = false;
      for(i = 0; i < palabra_objetivo.length; i++) {
        if(letra == palabra_objetivo[i]) {
          this.set_progreso(letra,i);
          restantes--;
          exito = true;
          this.sumar_puntos();
        }
      }

      if(!exito) {
        this.sub_vida();
        this.restar_puntos();
      }

    }
  };

  this.terminar_juego = function() {
    progreso = palabra_objetivo;
    vidas = 0;
    return puntos;
  }
  
}


// Clase GUI
function GUI(palabras, jugador) {
  var palabras = palabras;
  var jugador = jugador;
  var juego;

  var ctrl_intentos = document.querySelector("#intentos");
  var ctrl_progreso = document.querySelector("#progreso");
  var ctrl_letra = document.querySelector("#letra");
  var alert_victoria = document.querySelector("#victoria");
  var alert_derrota = document.querySelector("#derrota");

  var ctrl_nombre_usuario = document.querySelector("#nombre-usuario");
  ctrl_nombre_usuario.innerHTML = jugador.get_nombre_jugador();

  var ctrl_puntos_usuario = document.querySelector("#puntos-usuario");
  ctrl_puntos_usuario.innerHTML = jugador.get_puntos();

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

    alert_victoria.style.display = "none";
    alert_derrota.style.display = "none";

    ctrl_letra.focus();
  };

  this.terminar_juego = function(victoria) {
    puntos = juego.terminar_juego();
    jugador.add_puntos(puntos);

    localStorage.setItem('puntos', jugador.get_puntos());

    ctrl_puntos_usuario.innerHTML = jugador.get_puntos();

    if(victoria) {
      alert_victoria.style.display = "block";
    }
    else {
      alert_derrota.style.display = "block";
    }
  }

  this.jugar_letra = function() {
    letra = ctrl_letra.value;
    ctrl_letra.value = "";

    juego.probar_letra(letra);

    this.dibujar_ahorcado(juego.get_vidas());

    if(juego.get_vidas() < 1) {
      this.terminar_juego();
    }

    if(juego.get_restantes < 1) {
      this.terminar_juego();
    }
    
    this.set_intentos(juego.get_intentos());
    this.set_progreso(juego.get_progreso());
    
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

  this.adm_usuario = function() {
    document.querySelector('.adm-usuario').style.display = "block";
    ctrl_usuario.focus();
  }

  this.cambiar_nombre = function() {
    nombre = ctrl_usuario.value;
    if(nombre != '') {
      jugador.set_nombre_jugador(nombre);
      ctrl_nombre_usuario.innerHTML = nombre;
      localStorage.setItem('nombre-jugador', nombre);
    }

    document.querySelector('.adm-usuario').style.display = "none";
    document.querySelector('#alerta-nombre').style.display = "block";
  };

  this.borrar_puntos = function() {
    jugador.borrar_puntos();
    localStorage.setItem('puntos', 0);
    ctrl_puntos_usuario.innerHTML = '0';
    document.querySelector('#alerta-puntos').style.display = "block";
  }
}

var gui;


// main
function init() {
  palabras = new Palabras(lista_palabras);

  if(localStorage.getItem('nombre-jugador') != undefined) {
    nombre_jugador = localStorage.getItem('nombre-jugador');
  }
  else {
    localStorage.setItem('nombre-jugador', 'Anonimo');
    nombre_jugador = 'Anonimo';
  }

  if(localStorage.getItem('puntos') != undefined) {
    puntos = parseInt(localStorage.getItem('puntos'));
  }
  else {
    localStorage.setItem('puntos', '0');
    puntos = 0;
  }

  jugador = new Jugador(nombre_jugador, puntos);

  gui = new GUI(palabras, jugador);

  gui.nuevo_juego();
}