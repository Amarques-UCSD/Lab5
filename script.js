// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const canvas = document.getElementById("user-image");
const context = canvas.getContext('2d');
const btnNode = document.getElementById("button-group").childNodes;
  

var voiceSelect = document.getElementById("voice-selection");
voiceSelect.disabled = false;
var voices = [];

window.speechSynthesis.onvoiceschanged = function() {
  populateVoiceList();
};

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

function populateVoiceList() {
  voiceSelect.remove(0);
  voices = window.speechSynthesis.getVoices();
  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }
    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}


// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO
  const dim = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  context.fillRect(0, 0, canvas.width, canvas.height);
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
  context.drawImage(img, dim.startX, dim.startY, dim.width, dim.height);
});


document.getElementById("image-input").addEventListener('change', function() {
//function updateImg() {
  img.src  = URL.createObjectURL(this.files[0]);
  img.alt = `${img.src}`;

  btnNode[1].disabled = false;
  btnNode[3].disabled = false;
});


document.getElementById("generate-meme").addEventListener('submit', function() {
//function generateMeme() {
  alert("Generating");
  
  context.font = "30px Arial";
  context.textAlign = "center";
  context.fillStyle = "white";

  context.fillText(`${document.getElementById("text-top").value}`, canvas.width/2, 25);
  context.fillText(`${document.getElementById("text-bottom").value}`, canvas.width/2, canvas.height - 5);
    
  btnNode[1].disabled = false;
  btnNode[3].disabled = false;

  alert("Done Generating");
});


btnNode[1].addEventListener('click', function() {
//function clear() {
  alert("Clear Button");
  context.clearRect(0, 0, canvas.width, canvas.height);
  btnNode[1].disabled = true;
  btnNode[3].disabled = true;
});


btnNode[3].addEventListener('click', function() {
  //function clear() {
    alert("Play sound");

    event.preventDefault();

    var utterThis = new SpeechSynthesisUtterance(`${document.getElementById("text-top").value} ${document.getElementById("text-bottom").value}`);
    var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(var i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
      }
    }
    utterThis.volume = myVolume;
    window.speechSynthesis.speak(utterThis);
  });
  
  var myVolume = 1.0;
  
  var volGroup = document.getElementById("volume-group").childNodes;
  volGroup[3].addEventListener('change', function() {
    if(volGroup[3].value == 0){
      volGroup[1].src = "./icons/volume-level-0.svg";
    } else if(volGroup[3].value >= 1 && volGroup[3].value <= 33) {
      volGroup[1].src = "./icons/volume-level-1.svg";
    } else if(volGroup[3].value >= 34 && volGroup[3].value <= 66) {
      volGroup[1].src = "./icons/volume-level-2.svg";
    } else {
      volGroup[1].src = "./icons/volume-level-3.svg";
    }
    myVolume = volGroup[3].value/100.0;
  
  });

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
