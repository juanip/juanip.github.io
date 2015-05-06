var imageRespository;
var IMAGES_PATH = "img/";
var currentImage;

function init() {
  drawUI(data[0]);

  img = document.querySelector(".image");
  cardImage = document.querySelector(".card-image");
  img.style.width = (cardImage.offsetWidth - 4) + "px";

  currentImage = data[0];
}

function drawUI(image) {
  titleElem = document.querySelector(".title");
  imgElem = document.querySelector(".image");
  descriptionElem = document.querySelector(".description");
  cardElem = document.querySelector(".card");
  cardDescriptionElem = document.querySelector(".card-description");

  titleElem.innerText = image["title"];
  imgElem.src = IMAGES_PATH + image["image"];  
  descriptionElem.innerText = image["description"];

  color = getColors(image["type"]);
  cardElem.style.background = color["card"];
  cardDescriptionElem.style.background = color["desc"];
}

function getColors(type) {
  colors = {
    card: "#95AFBA",
    desc: "#3F7CAC"
  };

  switch(type) {
    case "game": 
      colors["card"] = "#BD4089";
      colors["desc"] = "#42213D"; 
      break;
    case "drink":
      colors["card"] = "#8EB0AF";
      colors["desc"] = "#8B5B1F"; 
      break;
  }

  return colors;
}

function getImage(current) {
  flag = true;

  do {
    index = Math.floor(Math.random() * data.length);
    if(current["number"] !== data[index]["number"]) {
     flag = false; 
    }
  } while(flag);
  
  return data[index];
}

function play() {
  currentImage = getImage(currentImage);
  drawUI(currentImage);
}