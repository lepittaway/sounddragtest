/* Sounds */
var audio = []; //loaded audio files
var interviews = [
                  55, 55, 'bell',
                  45, 45, 'bratton',
                  10, 90, 'bratton'
                 ]; //interview audio info: x, y, name
var interviewsX = []; //x on 0 - 100 grid
var interviewsY = []; //y on 0 - 100 grid

var sounds = []; //sounds objects for display
var aD = 10;
var audioDiam; //real (screen) area diameter
var volFade1, volFade2, volFade3;

/* Location & Adjustments */
var canvasRad = 30000; //real (screen) area size
var offsetX, offsetY;
var areaW = 100; 
var areaH = 100;

/* Navigation Movement */
var gx, gy; //global movement
var meY = areaH/2; //start x
var meX = areaW/2; //start y
var disty = []; //disatnces from me to sound

/* Buttons */
var up, down, left, right; //buttons
var navSpeed = 0.05;
var playButton;

function preventBehavior(e) {
  e.preventDefault(); 
} // stop drag behaviour on mobile

function preload() {
  
  soundFormats('mp3', 'ogg');
  for (var i = 0; i < interviews.length; i += 3) {
    audio.push(loadSound('assets/sounds/'+interviews[i + 2]+'.mp3'));
  }
  
}
function setup() {
  
  createCanvas(windowWidth, windowHeight);
  document.addEventListener("touchmove", preventBehavior, {passive: false});
  
  audio[1].play();
  
  /* ---------------- BUTTONS ---------------- */
  playButton = new StartButton(windowWidth/2, 100, 15);
  up = new MoveButton(windowWidth/2, 40, 15);
  down = new MoveButton(windowWidth/2, windowHeight - 40, 15);
  left = new MoveButton(40, windowHeight/2, 15);
  right = new MoveButton(windowWidth - 40, windowHeight/2, 15);
  
  /* ---------------- SOUND ---------------- */
  for (var i = 0; i < interviews.length; i += 3) {
    sounds.push(new Sound(interviews[i + 2], interviews[i], interviews[i + 1], 80, 300, 'red'));
  }
  for (var i = 0; i < interviews.length; i += 3) {
    interviewsX.push(interviews[i]);
    interviewsY.push(interviews[i + 1]);
  } 
  
}
function draw() {
  
  /* ---------------- ENVIRONMENT ---------------- */
  background('#fdfdfd');
  //drawGrid(gx, gy, 1);
  
  offsetX = windowWidth/2; //adjustment to centre
  offsetY = windowHeight/2; //adjustment to centre
  
  /* ----------------- NAVIGATION ---------------- */ 
  var xc = constrain(meX, 0, areaW); //constrain movement to edge of 'area'
  var yc = constrain(meY, 0, areaH);
  
  gx = map(xc, 0, areaW, -canvasRad, canvasRad); //map constrained location on 0 - 100 to screen space
  gy = map(yc, 0, areaH, -canvasRad, canvasRad);
  
  /* -------------------- SOUNDS ---------------- */
  audioDiam = map(aD, 0, 100, 0, canvasRad*2);
  drawSounds(); 
  triggerSound(); 
  
  /* -------------------- MAP AND HELPERS ------------- */
  var mapScale = 2;
  fill(0);
  textSize(12);
  text('X = '+ round(xc), windowWidth - (areaW * mapScale), areaH * mapScale + 14); //location on 0 - 100
  text('Y = '+ round(yc), windowWidth - (areaW*mapScale), areaH * mapScale + 28);//location on 0 - 100
  drawMap(0, 0, xc, yc, 100, 100, mapScale);
  
  fill('#0f0f0f');
  ellipse(windowWidth/2, windowHeight/2, 30, 30);
  
  
  
}

function Sound(name, x, y, r1, r2, col) {

  this.x = x;
  this.y = y;
  this.r1 = r1;
  this.r2 = r2;
  this.col = color(col);
  this.name = name;
  
  this.display = function() {

    stroke(this.col);
    strokeWeight(10);
    ellipse(this.x, this.y, this.r1, this.r1);
    stroke('lightgrey');
    strokeWeight(1);
    noFill();
    ellipse(this.x, this.y, this.r2, this.r2);
  }
  
  
}
function drawSounds() {
  
  for ( var i = 0; i < sounds.length; i += 1 ) {
    for ( var j = 0; j < interviews.length; j += 3 ) {
      sounds[i].display();
      sounds[i].x = map(interviews[j], 0, 100, -canvasRad, canvasRad) + offsetX - gx;
      sounds[i].y = map(interviews[j + 1], 0, 100, -canvasRad, canvasRad) + offsetY - gy;
      sounds[i].r2 = audioDiam;
    }
  }
  
}
function triggerSound() {
  
  for ( var i = 0; i < audio.length; i += 1 ) {
    let sd1 = dist(meX, meY, interviewsX[i], interviewsY[i]) * 10; //distance from sound on 0 - 100
    let sd12 = round( sd1 ) / 10;
    volFade1 = constrain( sd12, 0, aD/2 );
    volFade2 = map(volFade1, 0, aD/2, 0, PI);
    volFade3 = map(cos(volFade2), 1, -1, 1, 0);
    if ( sd12 < aD/2 + 0.4 && sd12 > aD/2 - 0.4 ) {
      disty.push( sd12 );
      if ( disty[disty.length-1] === aD/2) {
        if ( disty[disty.length-1] < disty[disty.length-2] && audio[i].isPlaying() === false ) {
          console.log('PLAY');
          audio[i].play();
        }
        if ( disty[disty.length-1] > disty[disty.length-2] && audio[i].isPlaying() === true ) {
          console.log('PAUSE');
          audio[i].pause();
        }
      } else if ( disty[disty.length-1] === (aD/2 - 0.1)) {
        if ( disty[disty.length-1] < disty[disty.length-2] && audio[i].isPlaying() === false ) {
          console.log('PLAY');
          audio[i].play();
        }
        if ( disty[disty.length-1] > disty[disty.length-2] && audio[i].isPlaying() === true ) {
          console.log('PAUSE');
          audio[i].pause();
        }
      } else if ( disty[disty.length-1] === (aD/2 - 0.2)) {
        if ( disty[disty.length-1] < disty[disty.length-2] && audio[i].isPlaying() === false ) {
          console.log('PLAY');
          audio[i].play();
        }
        if ( disty[disty.length-1] > disty[disty.length-2] && audio[i].isPlaying() === true ) {
          console.log('PAUSE');
          audio[i].pause();
        }
      } else if ( disty[disty.length-1] === (aD/2 - 0.3)) {
        if ( disty[disty.length-1] < disty[disty.length-2] && audio[i].isPlaying() === false ) {
          console.log('PLAY');
          audio[i].play();
        }
        if ( disty[disty.length-1] > disty[disty.length-2] && audio[i].isPlaying() === true ) {
          console.log('PAUSE');
          audio[i].pause();
        }
      }
    }
    if ( sd12 < aD/2 ) {
      audio[i].setVolume(volFade3); 
    }
  }
  
}
function drawGrid(gx, gy, spacing){
  
  for ( var i = 0; i < areaW; i += spacing ) {
    for ( var j = 0; j < areaH; j += spacing ) {
      fill(0);
      var gmx = map(i, 0, 100, -canvasRad, canvasRad);
      var gmy = map(j, 0, 100, -canvasRad, canvasRad);
      ellipse(gmx - gx + offsetX, gmy - gy + offsetY, 4, 4);
    }
  }
}
function drawMap(x, y, mmeX, mmeY, w, h, scale) {
  //draw map area
  stroke(0);
  fill('f0f0f0');
  rectMode(CORNER);
  rect(x + windowWidth - (w * scale), y, w * scale, h * scale);
  
  //sound sound location and playing radius
  for ( var i = 0; i < interviews.length; i += 3 ) {
    fill(0, 0, 255);
    ellipse(x + windowWidth - areaW*scale + interviews[i]*scale, y + interviews[i + 1]*scale, 5, 5);
    
    noFill();
    stroke('black');
    ellipse(x + windowWidth - areaW*scale + interviews[i]*scale, y + interviews[i + 1]*scale, aD*scale, aD*scale); 
  }
  
  // draw me!
  fill(255, 0, 0);
  noStroke();
  var scaleW = map(mmeX, 0, areaW, -(w/2 * scale), w/2 * scale);
  var scaleH = map(mmeY, 0, areaH, -(h/2 * scale), h/2 * scale);
  ellipse(x + windowWidth - (w/2 * scale) + scaleW, y + (w/2 * scale) + scaleH, 5, 5);   
}

function drawNavButtons(){
  up.display();
  up.x = windowWidth/2;
  
  down.display();
  down.x = windowWidth/2;
  down.y = windowHeight - 40;
  
  left.display();
  left.y = windowHeight/2;
  
  right.display();
  right.y = windowHeight/2;
  right.x = windowWidth - 40;
  
  
  
  if (mouseIsPressed) {
    let d1 = dist(mouseX, mouseY, up.x, up.y); 
    if (d1 < up.r) {
      meY -= navSpeed;
    }
    let d2 = dist(mouseX, mouseY, down.x, down.y); 
    if (d2 < down.r) {
      meY += navSpeed;
    }
    let d3 = dist(mouseX, mouseY, left.x, left.y); 
    if (d3 < left.r) {
      meX -= navSpeed;
    }
    let d4 = dist(mouseX, mouseY, right.x, right.y); 
    if (d4 < right.r) {
      meX += navSpeed;
    }
  }
}
function StartButton(x, y, radius) {
  
  this.x = x;
  this.y = y;
  this.r = radius;
  this.col = color('#0f0f0f');
  
  this.display = function() {
    noStroke();
    fill(this.col);
    rectMode(RADIUS);
    rect(this.x, this.y, this.r, this.r);
  }
  
  this.clicked = function() {
    let d = dist(mouseX, mouseY, this.x, this.y); 
    if (d < this.r) {
      this.col = color (0, 0, 255);
      audio[0].play();
      audio[0].loop();
    }
    
  }
  
  this.released = function() {
    this.col = color ('#0f0f0f');
  }
}
function MoveButton(x, y, radius) {
  
  this.x = x;
  this.y = y;
  this.r = radius;
  this.col = color('#0f0f0f');
  
  this.display = function() {
    noStroke();
    fill(this.col);
    rectMode(RADIUS);
    rect(this.x, this.y, this.r, this.r);
  }
  
  this.clicked = function() {
    let d = dist(mouseX, mouseY, this.x, this.y); 
    if (d < this.r) {
      this.col = color (0, 0, 255);
    }
  }
  
  this.released = function() {
    this.col = color ('#0f0f0f');
  }
}

function touchMoved() {
  
  var realNumx = mouseX - pmouseX;
  gx -= realNumx;
  meX -= map(realNumx, 0, canvasRad*2, 0, 100);
  var realNumy = mouseY - pmouseY;
  gy -= realNumy;
  meY -= map(realNumy, 0, canvasRad*2, 0, 100);
  
}
function touchStarted() {
  playButton.clicked();
  up.clicked();
  down.clicked();
  left.clicked();
  right.clicked();
}
function touchEnded() {
  playButton.released();
  up.released();
  down.released();
  left.released();
  right.released();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}