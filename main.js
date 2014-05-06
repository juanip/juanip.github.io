var POBLACION = 10;
var GENES = 30;
var COEF = Math.pow(2,30)-1;
//precalculated powers of 2
var POWS = new Array(GENES);

var crossover;
var mutacion;
var ciclos;
var cicloActual;

var cromosoma = new Array(POBLACION);

// actualX[x] [x]>>cromosoma
var fObjetivoActual = new Array(POBLACION);
var fFitnessActual = new Array(POBLACION);
var ruletaActual = new Array(POBLACION);

// mejorCromosoma: [0]>>generation [1]>>fObjective [2]>>fFitness [3]>>dec [4]>>bin
var mejorCromosoma = new Array(5);
//same mejorCromosoma, except [4] >> average generation fObjective
var mejorCromosomaActual = new Array(5);

// data[x][y]: [x]>>generation [y]: [0]>>max fObjective [1]>>min fObjective [2]>>average fObjective
var data;

function main(){
	//initialize POWS
	for(i=0;i<GENES;i++){
		POWS[i] = Math.pow(2,i);
	}
}

function btnPlay(){
	//interfaz
	document.getElementById("current-generation").style.display = "block";
	document.getElementById("play").disabled = true;
	document.getElementById("stop").disabled = false;
	document.getElementById("next").disabled = false;
	document.getElementById("finish").disabled = false;
	document.getElementById("crossover").disabled = true;
	document.getElementById("mutacion").disabled = true;
	document.getElementById("ciclos").disabled = true;
	
	initVars();
	generarPoblacionInicial();
	analizarGeneracionActual();
	llenarTablaDatos(cicloActual, mejorCromosomaActual[1], minFObjetivo, fObjetivoSuma/POBLACION);
	llenarTablaGeneracioActual();
	actualizarInfoMejorCromosomaActual();
	ActualizarInfoMejorCromosoma();
	cicloActual++;
}

function btnNext(){
	if(cicloActual < ciclos){
		limpiarTablaGeneracionActual();
		crearNuevaGeneracion();
		analizarGeneracionActual();
		if((cicloActual % Math.floor(ciclos/20)) == 0) {
			llenarTablaDatos(cicloActual, mejorCromosomaActual[1], minFObjetivo, fObjetivoSuma/POBLACION);
		}
		llenarTablaGeneracioActual();
		actualizarInfoMejorCromosomaActual();
		ActualizarInfoMejorCromosoma();
		cicloActual++;

		if(cicloActual===ciclos){
			document.getElementById("next").disabled = true;
			document.getElementById("finish").disabled = true;	
		}
	}
	else{
		document.getElementById("next").disabled = true;
		document.getElementById("finish").disabled = true;	
		document.getElementById("data").style.display = "block";
	}
}

function btnFinish(){
	for(;cicloActual<ciclos;cicloActual++){
		crearNuevaGeneracion();
		analizarGeneracionActual();
		if(((cicloActual+1) % Math.floor(ciclos/20)) == 0) {
			llenarTablaDatos(cicloActual, mejorCromosomaActual[1], minFObjetivo, fObjetivoSuma/POBLACION);
		}
	}
	limpiarTablaGeneracionActual();
	llenarTablaGeneracioActual();
	actualizarInfoMejorCromosomaActual();
	ActualizarInfoMejorCromosoma();
	document.getElementById("next").disabled = true;
	document.getElementById("finish").disabled = true;	
	document.getElementById("data").style.display = "block";

}

function btnStop(){
	//interfaz
	document.getElementById("current-generation").style.display = "none";
	document.getElementById("play").disabled = false;
	document.getElementById("stop").disabled = true;
	document.getElementById("next").disabled = true;
	document.getElementById("finish").disabled = true;	
	document.getElementById("crossover").disabled = false;
	document.getElementById("mutacion").disabled = false;
	document.getElementById("ciclos").disabled = false;
	document.getElementById("text-current-generation").innerHTML = "Generaci&oacute;n: -";
	document.getElementById("text-current-average").innerHTML = "Promedio F. Objetivo: -";
	document.getElementById("text-current-max").innerHTML = "Valor: -";
	document.getElementById("text-best-generation").innerHTML = "Generaci&oacute;n: -";
	document.getElementById("text-best-objetive").innerHTML = "Promedio F. Objetivo: -";
	document.getElementById("text-best-decimal").innerHTML = "Valor: -";
	document.getElementById("data").style.display = "none";


	limpiarTablaGeneracionActual();
	limpiarTablaDatos();
}

function initVars(){
	//inicializa arreglo de cromosomas
	for(i=0;i<POBLACION;i++){
		cromosoma[i] = new Array(GENES);
	}

	//setea parametros
	crossover = document.getElementById("crossover").value;
	mutacion = document.getElementById("mutacion").value;
	ciclos = document.getElementById("ciclos").value;

	//inicializa historico de datos
	data = new Array(ciclos);
	for(i=0;i<ciclos;i++){
		data[i] = new Array(3);
	}

	//generation 0
	cicloActual = 0;

	for(i=0;i<4;i++){
		mejorCromosoma[i] = 0;
	}
	mejorCromosoma[4] = new Array(GENES);
}

function generarPoblacionInicial(){
	for(i=0;i<POBLACION;i++){
		for(j=0;j<GENES;j++){
			cromosoma[i][j] = Math.floor((Math.random()*2)) ? '1' : '0';
		}
	}
}

function analizarGeneracionActual(){
	fObjetivoSuma = 0;
	minFObjetivo = 1;

	for(i=0;i<POBLACION;i++){
		fObjetivoActual[i] = 0;
		fFitnessActual[i] = 0;
	}
	//guarda la funcion objetivo de todos los cromosomas
	decimal = 0;
	for(index=0;index<POBLACION;index++){
		decimal = binToDec(cromosoma[index]);
		fObjetivoActual[index] = calcularFObjetivo(decimal);
	}

	//funcion objetivo mas baja
	for(i=0;i<POBLACION;i++){
		if(fObjetivoActual[i]<minFObjetivo){
			minFObjetivo = fObjetivoActual[i];
		}
	}

	//suma las funciones objetivo
	for(i=0;i<POBLACION;i++){
		fObjetivoSuma = fObjetivoSuma + fObjetivoActual[i];
	}

	//calcula el fitness de todos los cromosomas 
	for(i=0;i<POBLACION;i++){
		fFitnessActual[i] = fObjetivoActual[i] / fObjetivoSuma;
	}

	//best cromosoma of the generation
	for(i=0;i<4;i++){
		mejorCromosomaActual[i] = 0;
	}

	for(index=0;index<POBLACION;index++){
		if(fObjetivoActual[index] > mejorCromosomaActual[1]){
			mejorCromosomaActual[0] = cicloActual;
			mejorCromosomaActual[1] = fObjetivoActual[index];
			mejorCromosomaActual[2] = fFitnessActual[index];
			mejorCromosomaActual[3] = binToDec(cromosoma[index]);
		}
	}
	mejorCromosomaActual[4] = fObjetivoSuma / POBLACION;

	//is this best Cromosoma the best Cromosoma of all time?
	if(mejorCromosomaActual[1] > mejorCromosoma[1]){
		mejorCromosoma[0] = mejorCromosomaActual[0];
		mejorCromosoma[1] = mejorCromosomaActual[1];
		mejorCromosoma[2] = mejorCromosomaActual[2];
		mejorCromosoma[3] = mejorCromosomaActual[3];
	}
}

function llenarTablaGeneracioActual(){
	tabla = document.getElementById("tabla-generacion-actual");
	td = new Array(3);
	for(i=0;i<POBLACION;i++){
		tr = document.createElement("tr");
		
		for(j=0;j<3;j++){
			td[j] = document.createElement("td");
			switch(j){
				case 0:	td[j].innerText = cromosoma[i].join(" ");
						break;
				case 1:	td[j].innerText = fObjetivoActual[i].toFixed(4);
						break;
				case 2:	td[j].innerText = fFitnessActual[i].toFixed(4);
						break;
			}

			tr.appendChild(td[j]);
		}		

		tabla.appendChild(tr);
	}
}

function actualizarInfoMejorCromosomaActual(){
	document.getElementById("text-current-generation").innerHTML = "Generaci&oacute;n: " + (mejorCromosomaActual[0] + 1);
	document.getElementById("text-current-average").innerHTML = "Promedio F. Objetivo: " + mejorCromosomaActual[4].toFixed(4);
	document.getElementById("text-current-max").innerHTML = "Valor: " + mejorCromosomaActual[3];
}

function ActualizarInfoMejorCromosoma(){
	document.getElementById("text-best-generation").innerHTML = "Generaci&oacute;n: " + (mejorCromosoma[0] + 1);
	document.getElementById("text-best-objetive").innerHTML = "F. Objetivo: " + mejorCromosoma[1].toFixed(4);
	document.getElementById("text-best-decimal").innerHTML = "Valor: " + mejorCromosoma[3];	
}

function limpiarTablaGeneracionActual(){
	tabla = document.getElementById("tabla-generacion-actual");
	for(i=1;i<POBLACION+1;i++){
		tabla.deleteRow(1);
	}
}

function limpiarTablaDatos(){
	tabla = document.getElementById("tabla-datos");
	trCount = tabla.getElementsByTagName("tr").length;
	for(i=1;i<trCount;i++){
		tabla.deleteRow(1);
	}
}

function calcularFObjetivo(x){
	x = x / COEF;
	x = Math.pow(x,2);
	return x;
}

function binToDec(chrom){
	dec = 0;
	indexPow = 0;
	for(indexChrom = GENES-1;indexChrom>=0;indexChrom--){
		dec = dec + (parseInt(chrom[indexChrom]) * POWS[indexPow]);
		indexPow++;
	}
	return dec;
}

function crearNuevaGeneracion(){

	ruletaSuma = armarRuleta();
	cromosomasPadres = new Array(POBLACION);


	for(i=0;i<POBLACION;i++){
		cromosomasPadres[i] = new Array(GENES);
	}

	//select parents
	for(i=0;i<POBLACION;i++){
		indexRuleta = Math.floor((Math.random()*ruletaSuma));
		cromosomasPadres[i] = cromosoma[ruleta[indexRuleta]];
	}

	//breeding
	for(indexChrom=0;indexChrom<POBLACION/2;indexChrom++){
		//crossover
		if(Math.floor((Math.random()*100)+1) < crossover){
			cromosomasHijos = doCrossover(cromosomasPadres[indexChrom*2],cromosomasPadres[indexChrom*2+1]);
		}
		else{
			cromosomasHijos = cromosomasPadres[indexChrom*2].concat(cromosomasPadres[indexChrom*2+1]);
		}

		//first child mutacion
		if(Math.floor((Math.random()*100)+1) < mutacion){
			cromosoma[indexChrom*2] = hacerMutacion(cromosomasHijos.slice(0,GENES));
		}
		else{
			cromosoma[indexChrom*2] = cromosomasHijos.slice(0,GENES);				
		}

		//second child mutacion
		if(Math.floor((Math.random()*100)+1) < mutacion){
			cromosoma[indexChrom*2+1] = hacerMutacion(cromosomasHijos.slice(GENES,GENES*2));
		}
		else{
			cromosoma[indexChrom*2+1] = cromosomasHijos.slice(GENES,GENES*2);				
		}
	}
}

function armarRuleta() {
	ruletaSuma = 0;
	
	for(i=0;i<POBLACION;i++){
		ruletaActual[i] = Math.ceil(fFitnessActual[i] * 100);
		if(ruletaActual[i]===0) ruletaActual[i] = 1;
		ruletaSuma += ruletaActual[i];
	}

	ruleta = new Array(ruletaSuma);

	indexRuleta = 0;
	for(i=0;i<POBLACION;i++){
		j = 0;
		while(j < ruletaActual[i]){
			ruleta[indexRuleta] = i;
			j++;
			indexRuleta++;
		}
	}

	return ruletaSuma;
}

function crearNuevaGeneracionOld(){
	cromosomasPadres = new Array(POBLACION);
	ruletaSuma = 0;
	
	for(i=0;i<POBLACION;i++){
		ruletaActual[i] = Math.ceil(fFitnessActual[i] * 100);
		if(ruletaActual[i]===0) ruletaActual[i] = 1;
		ruletaSuma += ruletaActual[i];
	}

	//ordenar ruleta 
	//ruletaOrdenada => cant de posiciones en ruleta
	//ruletaOrdenadaIndex => a que cromosoma corresponde esa cant de posiciones
	ruletaOrdenada = new Array(POBLACION);
	ruletaOrdenadaIndex = new Array(POBLACION);
	for(i=0;i<POBLACION;i++){
		ruletaOrdenada[i] = ruletaActual[i];
		ruletaOrdenadaIndex[i] = i;
	}

	aux = 0;
	auxIndex = 0;
	for(i=1;i<POBLACION-1;i++){
		for(j=0;j<POBLACION;j++){
			if(ruletaOrdenada[j]>ruletaOrdenada[j+1]){
				aux = ruletaOrdenada[j];
				auxIndex = ruletaOrdenadaIndex[j];
				
				ruletaOrdenada[j] = ruletaOrdenada[j+1];
				ruletaOrdenadaIndex[j] = ruletaOrdenadaIndex[j+1];
				
				ruletaOrdenada[j+1] = aux;
				ruletaOrdenadaIndex[j+1] = auxIndex;
			}
		}
	}


	cromosomasOrdenadosParaRuleta = new Array(POBLACION);
	for(i=0,j=9;i<POBLACION;i++,j--){
		cromosomasOrdenadosParaRuleta[i] = cromosoma[ruletaOrdenadaIndex[j]];
	}


	//Rellena ruleta 
	Ruleta = new Array();
	RuletaAux = new Array(ruletaSuma);

	indexRuleta = 0;
	for(i=0;i<POBLACION;i++){
		j = 0;
		while(j < ruletaOrdenada[i]){
			if(indexRuleta>99) break;
			RuletaAux[indexRuleta] = ruletaOrdenadaIndex[i];
			j++;
			indexRuleta++;
		}
		if(indexRuleta>99) break;
	}

	//Limpia ruleta de espacios vacios
	for(i=0;i<RuletaAux.length;i++){
		if(RuletaAux[i]>=0) Ruleta[i] = RuletaAux[i];
	
	}

	for(i=0;i<POBLACION;i++){
		cromosomasPadres[i] = new Array(GENES);
	}

	//select parents
	for(i=0;i<POBLACION;i++){
		indexRuleta = Math.floor((Math.random()*100));
		cromosomasPadres[i] = cromosomasOrdenadosParaRuleta[Ruleta[indexRuleta]];
	}

	//breeding
	for(indexChrom=0;indexChrom<POBLACION/2;indexChrom++){
		//crossover
		if(Math.floor((Math.random()*100)+1) < crossover){
			cromosomasHijos = doCrossover(cromosomasPadres[indexChrom*2],cromosomasPadres[indexChrom*2+1]);
		}
		else{
			cromosomasHijos = cromosomasPadres[indexChrom*2].concat(cromosomasPadres[indexChrom*2+1]);
		}

		//first child mutacion
		if(Math.floor((Math.random()*100)+1) < mutacion){
			cromosoma[indexChrom*2] = hacerMutacion(cromosomasHijos.slice(0,GENES));
		}
		else{
			cromosoma[indexChrom*2] = cromosomasHijos.slice(0,GENES);				
		}

		//second child mutacion
		if(Math.floor((Math.random()*100)+1) < mutacion){
			cromosoma[indexChrom*2+1] = hacerMutacion(cromosomasHijos.slice(GENES,GENES*2));
		}
		else{
			cromosoma[indexChrom*2+1] = cromosomasHijos.slice(GENES,GENES*2);				
		}
	}
}

//return a Array[GENES*2] with the children
function doCrossover(primerPadre, segundoPadre){
	primerHijo = new Array(GENES);
	segundoHijo = new Array(GENES);
	iCorte = 20;//Math.floor((Math.random()*(GENES)));
	
	for(index=0;index<iCorte;index++){
		primerHijo[index] = primerPadre[index];
		segundoHijo[index] = segundoPadre[index];
	}

	for(index=iCorte;index<GENES;index++){
		primerHijo[index] = segundoPadre[index];
		segundoHijo[index] = primerPadre[index];
	}

	return primerHijo.concat(segundoHijo);
}

//return a Array[GENES] with mutate children
function hacerMutacion(cromosomaHijo){
	randomGEN = Math.floor((Math.random()*GENES));
	
	cromosomaHijo[randomGEN] = cromosomaHijo[randomGEN] === "1" ? "0" : "1";
	return cromosomaHijo;
}

function llenarTablaDatos(gen, maxFObj, minFObj, promFObj){
	tabla = document.getElementById("tabla-datos");
	td = new Array(4);
	
	for(i=0;i<4;i++){	
		td[i] = document.createElement("td");
	}
	
	td[0].innerText = gen+1;
	td[1].innerText = maxFObj.toFixed(6).replace(".", ",");
	td[2].innerText = minFObj.toFixed(6).replace(".", ",");;
	td[3].innerText = promFObj.toFixed(6).replace(".", ",");

	tr = document.createElement("tr");
	
	for(i=0;i<4;i++){
		tr.appendChild(td[i]);	
	}

	tabla.appendChild(tr);
}