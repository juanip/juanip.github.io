var COLOR = "#000FFF";
var BLANCO = "#FFFFFF";
var ALTOTABLERO = 50;
var LARGOTABLERO = 50;
var ALTOCASILLERO = 10;
var LARGOCASILLERO = 10;
var DELAY = 100; //en milisegundos

var matriz = new Array();
var canvas;
var tablero;
var auto;
var fauto = true;
var contGen = new Number;

function vivir(){
  var vida = true;
  var matrizVieja = new Array();
  var flag;
  var aux;

  contGen++;
  document.getElementById("gen").innerHTML = contGen;

  function draw(x,y,z){
    tablero.fillStyle = (z == 'si') ? COLOR : BLANCO;
    tablero.fillRect(x*LARGOCASILLERO,y*ALTOCASILLERO,ALTOCASILLERO,LARGOCASILLERO);
  }

  function ver(x,y,m){
    var contador = new Number;
    contador = 0;
    if(x>0) if(m[x-1][y]==1) contador++;
    if(y>0) if(m[x][y-1]==1) contador++;
    if(x<LARGOTABLERO-1) if(m[x+1][y]==1) contador++;
    if(y<LARGOTABLERO-1) if(m[x][y+1]==1) contador++;
    if(x>0 && y>0) if(m[x-1][y-1]) contador++;
    if(x<LARGOTABLERO-1 && y<LARGOTABLERO-1) if(m[x+1][y+1]) contador++;
    if(x>0 && y<LARGOTABLERO-1) if(m[x-1][y+1]) contador++;
    if(x<LARGOTABLERO-1 && y>0) if(m[x+1][y-1]) contador++;

    if(contador==3) return 1;
    else if(contador==2){
      if(m[x][y]) return 1;
      else return 0;
    }
    else return 0;
  }

  for(var i=0;i<LARGOTABLERO;i++){
    matrizVieja[i] = new Array();
    for(var j=0;j<ALTOTABLERO;j++){
      matrizVieja[i][j] = matriz[i][j];
    }
  }

  for(var i=0;i<LARGOTABLERO;i++){
    for(var j=0;j<ALTOTABLERO;j++){
      matriz[i][j] = ver(i,j,matrizVieja);
    }
  }

  for(i=0;i<LARGOTABLERO;i++){
    for(j=0;j<ALTOTABLERO;j++){
      if(matriz[i][j]) draw(i,j,'si');
      else draw(i,j,'no');
     }
  }
}

function automatico(){
  if(fauto){
    fauto=false;
    auto=setInterval(function(){vivir()},DELAY);
    document.getElementById("automatico").value = "Parar";
  }
  else{
    fauto=true;
    clearInterval(auto);
    document.getElementById("automatico").value = "Iniciar";
  }  
}
 
function dibujar(x){
  var aleat;
  canvas = document.getElementById("miCanvas");
  tablero = canvas.getContext("2d");

  if(!fauto){
    fauto=true;
    clearInterval(auto);
    document.getElementById("automatico").value = "Iniciar";
  }

  resetCont();

  //QUE DIBUJA
  switch(x){
    //EN BLANCO
    case 0:
      for(var i=0;i<LARGOTABLERO;i++){
        matriz[i] = new Array();
        for(var j=0;j<ALTOTABLERO;j++){
          matriz[i][j] = 0;
        }
      }
      break;
    //ALETORIO
    case 1:
      for(var i=0;i<LARGOTABLERO;i++){
        matriz[i] = new Array();
        for(var j=0;j<ALTOTABLERO;j++){
          aleat = Math.random()*1;
          aleat = Math.round(aleat);
          matriz[i][j] = aleat;
        }
      }
      break;
  }

  function draw(x,y,z){
    tablero.fillStyle = (z == "si") ? COLOR : BLANCO;
    tablero.fillRect(x*LARGOCASILLERO,y*ALTOCASILLERO,LARGOCASILLERO,ALTOCASILLERO);
  }
  
  for(i=0;i<LARGOTABLERO;i++){
    for(j=0;j<ALTOTABLERO;j++){
      if(matriz[i][j]) draw(i,j,"si");
      else draw(i,j,"no");
     }
  }
}

function clicks(event){
    pos_x = event.offsetX;
    pos_y = event.offsetY;
    pos_x = Math.floor(pos_x / LARGOCASILLERO);
    pos_y = Math.floor(pos_y / ALTOCASILLERO);

    function draw(x,y,z){
      tablero.fillStyle = (z == 'si') ? COLOR : BLANCO;
      tablero.fillRect(x*LARGOCASILLERO,y*ALTOCASILLERO,ALTOCASILLERO,LARGOCASILLERO);
    }

    if((pos_x < LARGOTABLERO)&&(pos_y < ALTOTABLERO)){
      if(matriz[pos_x][pos_y]){
        matriz[pos_x][pos_y] = 0;
        draw(pos_x,pos_y,'no');
      }
      else{
        matriz[pos_x][pos_y] = 1;
        draw(pos_x,pos_y,'si');
      }
    }
}

function resetCont(){
  contGen = 0;
  document.getElementById("gen").innerHTML = 0;
}

function saveCanvas(){
  var code = "";
  if(!fauto){
    fauto=true;
    clearInterval(auto);
    document.getElementById("automatico").value = "Iniciar";
  }

  for(var i=0;i<LARGOTABLERO;i++){
    for(var j=0;j<ALTOTABLERO;j++){
      code = code + matriz[i][j];
    }
  }

  document.getElementById("saveCode").value = code;
}

function loadCanvas(){
  var code = document.getElementById("loadCode").value;
  var codeIndex = 0;
   if(!fauto){
    fauto=true;
    clearInterval(auto);
    document.getElementById("automatico").value = "Iniciar";
  }
  
  function draw(x,y,z){
      tablero.fillStyle = (z == 'si') ? COLOR : BLANCO;
      tablero.fillRect(x*LARGOCASILLERO,y*ALTOCASILLERO,ALTOCASILLERO,LARGOCASILLERO);
  }

  for(var i=0;i<LARGOTABLERO;i++){
    for(var j=0;j<ALTOTABLERO;j++){
      if((code[codeIndex]!=0)&&(code[codeIndex]!=1)){
        matriz[i][j] = 0;
      }
      else{
        matriz[i][j] = code[codeIndex]==1 ? 1 : 0;
      }
      codeIndex++;
       
      if(matriz[i][j]==1) draw(i,j,'si');
      else draw(i,j,'no');
    }
  }
}
