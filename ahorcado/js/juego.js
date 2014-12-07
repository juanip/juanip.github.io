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