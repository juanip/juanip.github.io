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