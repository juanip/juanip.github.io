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
var Jugador = function(datos) {
  var nombre = datos['nombre_jugador'];
  var nivel = parseInt(datos['nivel']);
  var puntos = parseInt(datos['puntos']);
  var partidas = parseInt(datos['partidas']);
  var aciertos = parseInt(datos['aciertos']);
  var errores = parseInt(datos['errores']);

  var tabla_niveles = {
    '1' : 100,
    '2' : 250,
    '3' : 365,
    '4' : 574,
    '5' : 892,
    '6' : 1389,
    '7' : 2162,
    '8' : 3366,
    '9' : 5240,
    '10' : 8158,
    '11' : 12701,
    '12' : 19774,
    '13' : 30786,
    '14' : 47931,
    '15' : 74624,
    '16' : 116183,
    '17' : 180887,
    '18' : 281626,
    '19' : 438468,
    '20' : 682658
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
    if(this.get_puntos() > tabla_niveles[this.get_nivel()]) {
      nivel++;
    }
  };

  this.get_nivel = function() {
    return nivel;
  };

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


// Clase Juego
var Juego = function(palabra) {
  var palabra_objetivo = palabra;
  var intentos = "";
  var progreso = "";
  var restantes = palabra_objetivo.length;
  var vidas = 6;
  var puntos = 0;
  var juego_finalizado = false;

  var puntos_sumar = 12;
  var puntos_restar = 11;

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
    resultados = {
        'aciertos' : 0,
        'errores' : 0,
    };
    
    valida = letra.match(/[A-Z]/i) || letra == "ñ" ? true : false;

    if(valida && intentos.indexOf(letra) == -1 && vidas > 0 && restantes > 0 && !this.get_juego_finalizado()) {
      this.set_intentos(letra);

      exito = false;
      for(i = 0; i < palabra_objetivo.length; i++) {
        if(letra == palabra_objetivo[i]) {
          this.set_progreso(letra,i);
          restantes--;
          exito = true;
          this.sumar_puntos();
          resultados['aciertos']++;
        }
      }

      if(!exito) {
        this.sub_vida();
        this.restar_puntos();
        resultados['errores'] = 1;
      }
    }

    return resultados;
  };

  this.get_juego_finalizado = function() {
    return juego_finalizado;
  };

  this.terminar_juego = function() {
    progreso = palabra_objetivo;
    vidas = 0;
    juego_finalizado = true;
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
  var puntos_victoria = document.querySelector("#puntos-victoria"); 
  var puntos_derrota = document.querySelector("#puntos-derrota");

  var ctrl_nombre_usuario = document.querySelector("#nombre-usuario");
  ctrl_nombre_usuario.innerHTML = jugador.get_nombre_jugador();

  var ctrl_nivel_usuario = document.querySelector("#nivel-usuario");
  var ctrl_puntos_usuario = document.querySelector("#puntos-usuario");
  var ctrl_partidas_usuario = document.querySelector("#partidas-usuario");  
  var ctrl_aciertos_usuario = document.querySelector("#aciertos-usuario");  
  var ctrl_errores_usuario = document.querySelector("#errores-usuario");

  this.actualizar_datos = function() {
    ctrl_nivel_usuario.innerHTML = jugador.get_nivel();
    ctrl_puntos_usuario.innerHTML = jugador.get_puntos();
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

    alert_victoria.style.display = "none";
    alert_derrota.style.display = "none";
    document.querySelector('#alerta-nombre').style.display = "none";
    document.querySelector('#alerta-puntos').style.display = "none";

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
      letra = ctrl_letra.value;      
  
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

  this.adm_usuario = function() {
    document.querySelector('.adm-usuario').style.display = "block";
    ctrl_usuario.focus();
  }

  this.cambiar_nombre = function() {
    nombre = ctrl_usuario.value;
    if(nombre != '') {
      jugador.set_nombre_jugador(nombre);
      datos_jugador = jugador.get_datos();
      localStorage.setItem('datos_jugador', JSON.stringify(datos_jugador));

      ctrl_nombre_usuario.innerHTML = nombre;
  };

    document.querySelector('.adm-usuario').style.display = "none";
    document.querySelector('#alerta-nombre').style.display = "block";
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

    this.actualizar_datos();
    document.querySelector('#alerta-puntos').style.display = "block";
  };

  
}

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
}