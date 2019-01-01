var disty = [];
var distySort = [];
var minny;

var sound1Dist, sound1PDist;

/* Sounds */
var playButton;
var sound1;
var audio1, audio2;
var soundX = [50, 
              45, 
              100, 
              30]; //x cordinates on 0 - 100 grid
var soundY = [50, 
              45, 
              50, 
              100]; //y cordinates on 0 - 100 grid
var soundXnew = []; //x cordinates mapped onto screen size
var soundYnew = []; //y cordinates mapped onto screen size

var volFade1, volFade2;

/* Navigation & Movement */
var up, down, left, right; //buttons
var gx = 0;
var gy = 0; //global movement
var areaW = 100; 
var areaH = 100;
var navSpeed = 0.05;
var meY = 50; //start x
var meX = 50; //start y

/* Location & Adjustments */
var offsetX, offsetY;
var canvasRad;
var mapSize = 100;

var aD = 10;
var audioDiam;

function noscroll() {
  window.scrollTo( 0, 0 );
}

// add listener to disable scroll


function setup() {
  createCanvas(windowWidth, windowHeight);
 window.addEventListener('scroll', noscroll);
  
}


function draw() {
  
  
  /* ---------------- ENVIRONMENT ---------------- */
  background('red');
  canvasRad = windowWidth * 6;
  
  //screen space
  drawGrid(0 + gx, 0 + gy);
  

 
}

function drawGrid(gx, gy){
   for ( var i = -canvasRad; i < canvasRad; i += 300 ) {
    for ( var j = -canvasRad; j < canvasRad; j += 300 ) {
      fill(0);
      ellipse(i - gx, j - gy, 4, 4);
    }
  }
}

function touchMoved() {
  var hiX = mouseX - pmouseX;
  gx -= hiX;
  var hiY = mouseY - pmouseY;
  gy -= hiY;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}