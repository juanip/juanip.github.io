var POPULATION = 10;
var GENES = 30;
var COEF = Math.pow(2,30)-1;
//precalculated powers of 2
var POWS = new Array(GENES);

var crossover;
var mutation;
var cycles;
var currentCycle;

var chromosome = new Array(POPULATION);

// currentX[x] [x]>>chromosome
var currentObjective = new Array(POPULATION);
var currentFitness = new Array(POPULATION);
var currentRoulette = new Array(POPULATION);

// bestChromosome: [0]>>generation [1]>>fObjective [2]>>fFitness [3]>>dec [4]>>bin
var bestChromosome = new Array(5);
//same bestChromosome, except [4] >> average generation fObjective
var bestCurrentChromosome = new Array(5);

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
	document.getElementById("mutation").disabled = true;
	document.getElementById("cycles").disabled = true;
	
	initializeVars();
	generateInitialPOPULATION();
	analyzeCurrentGeneration();
	populateCurrentGenerationTable();
	updateCurrentBestChromosomeInfo();
	updateBestChromosomeInfo();
	currentCycle++;
}

function btnNext(){
	if(currentCycle < cycles){
		cleanCurrentGenerationTable();
		generateNewGeneration();
		analyzeCurrentGeneration();
		populateCurrentGenerationTable();
		updateCurrentBestChromosomeInfo();
		updateBestChromosomeInfo();
		currentCycle++;

		if(currentCycle===cycles){
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
	for(;currentCycle<cycles;currentCycle++){
		generateNewGeneration();
		analyzeCurrentGeneration();
	}
	cleanCurrentGenerationTable();
	populateCurrentGenerationTable();
	updateCurrentBestChromosomeInfo();
	updateBestChromosomeInfo();
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
	document.getElementById("mutation").disabled = false;
	document.getElementById("cycles").disabled = false;
	document.getElementById("text-current-generation").innerHTML = "Generaci&oacute;n: -";
	document.getElementById("text-current-average").innerHTML = "Promedio F. Objetivo: -";
	document.getElementById("text-current-max").innerHTML = "Valor: -";
	document.getElementById("text-best-generation").innerHTML = "Generaci&oacute;n: -";
	document.getElementById("text-best-objetive").innerHTML = "Promedio F. Objetivo: -";
	document.getElementById("text-best-decimal").innerHTML = "Valor: -";
	document.getElementById("data").style.display = "none";


	cleanCurrentGenerationTable();
}

function initializeVars(){
	//inicializa arreglo de cromosomas
	for(i=0;i<POPULATION;i++){
		chromosome[i] = new Array(GENES);
	}

	//setea parametros
	crossover = document.getElementById("crossover").value;
	mutation = document.getElementById("mutation").value;
	cycles = document.getElementById("cycles").value;

	//inicializa historico de datos
	data = new Array(cycles);
	for(i=0;i<cycles;i++){
		data[i] = new Array(3);
	}

	//generation 0
	currentCycle = 0;

	for(i=0;i<4;i++){
		bestChromosome[i] = 0;
	}
	bestChromosome[4] = new Array(GENES);
}

function generateInitialPOPULATION(){
	for(i=0;i<POPULATION;i++){
		for(j=0;j<GENES;j++){
			chromosome[i][j] = Math.floor((Math.random()*2)) ? '1' : '0';
		}
	}
}

function analyzeCurrentGeneration(){
	fObjectiveSum = 0;
	minFObjective = 1;

	for(i=0;i<POPULATION;i++){
		currentObjective[i] = 0;
		currentFitness[i] = 0;
	}
	//guarda la funcion objetivo de todos los cromosomas
	decimal = 0;
	for(index=0;index<POPULATION;index++){
		decimal = binToDec(chromosome[index]);
		currentObjective[index] = calculatefObjective(decimal);
	}

	//funcion objetivo mas baja
	for(i=0;i<POPULATION;i++){
		if(currentObjective[i]<minFObjective){
			minFObjective = currentObjective[i];
		}
	}

	//suma las funciones objetivo
	for(i=0;i<POPULATION;i++){
		fObjectiveSum = fObjectiveSum + currentObjective[i];
	}

	//calcula el fitness de todos los cromosomas 
	for(i=0;i<POPULATION;i++){
		currentFitness[i] = currentObjective[i] / fObjectiveSum;
	}

	//best chromosome of the generation
	for(i=0;i<4;i++){
		bestCurrentChromosome[i] = 0;
	}

	for(index=0;index<POPULATION;index++){
		if(currentObjective[index] > bestCurrentChromosome[1]){
			bestCurrentChromosome[0] = currentCycle;
			bestCurrentChromosome[1] = currentObjective[index];
			bestCurrentChromosome[2] = currentFitness[index];
			bestCurrentChromosome[3] = binToDec(chromosome[index]);
		}
	}
	bestCurrentChromosome[4] = fObjectiveSum / POPULATION;

	//is this best chromosome the best chromosome of all time?
	if(bestCurrentChromosome[1] > bestChromosome[1]){
		bestChromosome[0] = bestCurrentChromosome[0];
		bestChromosome[1] = bestCurrentChromosome[1];
		bestChromosome[2] = bestCurrentChromosome[2];
		bestChromosome[3] = bestCurrentChromosome[3];
	}

	sumRoulette = 0;
	for(i=0;i<POPULATION;i++){
		currentRoulette[i] = Math.ceil(currentFitness[i] * 100);
		if(currentRoulette[i]===0) currentRoulette[i] = 1;
		sumRoulette += currentRoulette[i];
	}

	massacre = sumRoulette - 100;

	orderRoulette = new Array(POPULATION);
	orderRouletteIndex = new Array(POPULATION);
	for(i=0;i<POPULATION;i++){
		orderRoulette[i] = currentRoulette[i];
		orderRouletteIndex[i] = i;
	}

	aux = 0;
	auxIndex = 0;
	for(i=1;i<POPULATION-1;i++){
		for(j=0;j<POPULATION;j++){
			if(orderRoulette[j]>orderRoulette[j+1]){
				aux = orderRoulette[j];
				orderRoulette[j] = orderRoulette[j+1];
				orderRoulette[j+1] = aux;
				auxIndex = j;
				orderRouletteIndex[j] = j+1;
				orderRouletteIndex[j+1] = auxIndex;
			}
		}
	}

	chromosomeAux = new Array(POPULATION);
	for(i=0,j=9;i<POPULATION;i++,j--){
		chromosomeAux[i] = chromosome[orderRouletteIndex[j]];
	}
	alert(chromosomeAux);
	//guardar chromosomeAux en chromosome, matar los que sobran, dejar la ruleta de 100 lugares
	//ser feliz

	populateDataTable(currentCycle, bestCurrentChromosome[1], minFObjective, fObjectiveSum/POPULATION);
}

function populateCurrentGenerationTable(){
	table = document.getElementById("current-generation-table");
	td = new Array(4);
	for(i=0;i<POPULATION;i++){
		tr = document.createElement("tr");
		
		for(j=0;j<4;j++){
			td[j] = document.createElement("td");
			switch(j){
				case 0:	td[j].innerText = chromosome[i].toString();
						break;
				case 1:	td[j].innerText = currentObjective[i].toFixed(4);
						break;
				case 2:	td[j].innerText = currentFitness[i].toFixed(4);
						break;
				case 3:	td[j].innerText = currentRoulette[i];
						break;
			}

			tr.appendChild(td[j]);
		}		

		table.appendChild(tr);
	}
}

function updateCurrentBestChromosomeInfo(){
	document.getElementById("text-current-generation").innerHTML = "Generaci&oacute;n: " + (bestCurrentChromosome[0] + 1);
	document.getElementById("text-current-average").innerHTML = "Promedio F. Objetivo: " + bestCurrentChromosome[4].toFixed(4);
	document.getElementById("text-current-max").innerHTML = "Valor: " + bestCurrentChromosome[3];
}

function updateBestChromosomeInfo(){
	document.getElementById("text-best-generation").innerHTML = "Generaci&oacute;n: " + (bestChromosome[0] + 1);
	document.getElementById("text-best-objetive").innerHTML = "F. Objetivo: " + bestChromosome[1].toFixed(4);
	document.getElementById("text-best-decimal").innerHTML = "Valor: " + bestChromosome[3];	
}

function cleanCurrentGenerationTable(){
	table = document.getElementById("current-generation-table");
	for(i=1;i<POPULATION+1;i++){
		table.deleteRow(1);
	}
}

function calculatefObjective(x){
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

function generateNewGeneration(){
	parentsChromosome = new Array(POPULATION);
	rouletteSum = 0;
	
	for(i=0;i<POPULATION;i++){
		rouletteSum = rouletteSum + currentRoulette[i];
	}

	roulette = new Array(rouletteSum);

	indexRoulette = 0;
	for(i=0;i<POPULATION;i++){
		j = 0;
		while(j < currentRoulette[i]){
			roulette[indexRoulette] = i;
			j++;
			indexRoulette++;
		}
	}

	for(i=0;i<POPULATION;i++){
		parentsChromosome[i] = new Array(GENES);
	}

	//select parents
	for(i=0;i<POPULATION;i++){
		indexRoulette = Math.floor((Math.random()*rouletteSum));
		parentsChromosome[i] = chromosome[roulette[indexRoulette]];
	}

	//breeding
	for(indexChrom=0;indexChrom<POPULATION/2;indexChrom++){
		//crossover
		if(Math.floor((Math.random()*100)+1) < crossover){
			childrenChromosome = doCrossover(parentsChromosome[indexChrom*2],parentsChromosome[indexChrom*2+1]);
		}
		else{
			childrenChromosome = parentsChromosome[indexChrom*2].concat(parentsChromosome[indexChrom*2+1]);
		}

		//first child mutation
		if(Math.floor((Math.random()*100)+1) < mutation){
			chromosome[indexChrom*2] = doMutate(childrenChromosome.slice(0,GENES));
		}
		else{
			chromosome[indexChrom*2] = childrenChromosome.slice(0,GENES);				
		}

		//second child mutation
		if(Math.floor((Math.random()*100)+1) < mutation){
			chromosome[indexChrom*2+1] = doMutate(childrenChromosome.slice(GENES,GENES*2));
		}
		else{
			chromosome[indexChrom*2+1] = childrenChromosome.slice(GENES,GENES*2);				
		}
	}
}

//return a Array[GENES*2] with the children
function doCrossover(firstParent, secondParent){
	firstChild = new Array(GENES);
	secondChild = new Array(GENES);
	cutIndex = 20;//Math.floor((Math.random()*(GENES)));
	
	for(index=0;index<cutIndex;index++){
		firstChild[index] = firstParent[index];
		secondChild[index] = secondParent[index];
	}

	for(index=cutIndex;index<GENES;index++){
		firstChild[index] = secondParent[index];
		secondChild[index] = firstParent[index];
	}

	return firstChild.concat(secondChild);
}

//return a Array[GENES] with mutate children
function doMutate(childChromosome){
	randomGEN = Math.floor((Math.random()*GENES));
	
	childChromosome[randomGEN] = childChromosome[randomGEN] === "1" ? "0" : "1";
	return childChromosome;
}

function populateDataTable(gen, maxFObj, minFObj, promFObj){
	table = document.getElementById("data-table");
	td = new Array(4);
	
	for(i=0;i<4;i++){	
		td[i] = document.createElement("td");
	}
	
	td[0].innerText = gen+1;
	td[1].innerText = maxFObj.toFixed(6);
	td[2].innerText = minFObj.toFixed(6);
	td[3].innerText = promFObj.toFixed(6);

	tr = document.createElement("tr");
	
	for(i=0;i<4;i++){
		tr.appendChild(td[i]);	
	}

	table.appendChild(tr);
}