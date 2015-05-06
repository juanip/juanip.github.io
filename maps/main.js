var map;
var gui;

function init () {
  canvas = document.getElementById('canvas');
  form = document.getElementById('directions');

  map = new Map(canvas);
  gui = new GUI(form, map);
}