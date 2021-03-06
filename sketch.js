/* Location & Adjustments */
var canvasRad = 30000; //real (screen) area size
var offsetX, offsetY;
var areaW = 100; 
var areaH = 100;

/* Sounds */
var audio = []; //loaded audio files
var interviews = [
                  55, 65, 'bell',
                  45, 45, 'bratton',
                  10, 90, 'bratton',
                  80, 25, 'bratton',
                  80, 55, 'bratton',
                 ]; //interview audio info: x, y, name
var interviewsX = []; //x on 0 - 100 grid
var interviewsY = []; //y on 0 - 100 grid

var sounds = []; //sounds objects for display
var aD = 10;
var audioDiam;
var volFade1, volFade2, volFade3;



/* Navigation Movement */
var gx, gy; //global movement
var meY = areaH/2; //start x
var meX = areaW/2; //start y
var disty = []; //disatnces from me to sound

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
  audioDiam = map(aD, 0, 100, 0, canvasRad*2); //real (screen) area diameter
  
  /* ---------------- SOUND ---------------- */
  for (var i = 0; i < interviews.length; i += 3) {
    sounds.push(new Sound(interviews[i + 2], interviews[i], interviews[i + 1], 80, audioDiam, 'red'));
  }
  for (var i = 0; i < interviews.length; i += 3) {
    interviewsX.push(interviews[i]);
    interviewsY.push(interviews[i + 1]);
  } 
  
}
function draw() {
  
  /* ---------------- ENVIRONMENT ---------------- */
  background('#000');
  //drawGrid(gx, gy, 1);
  
  offsetX = windowWidth/2; //adjustment to centre
  offsetY = windowHeight/2; //adjustment to centre
  
  /* ----------------- NAVIGATION ---------------- */ 
  var xc = constrain(meX, 0, areaW); //constrain movement to edge of 'area'
  var yc = constrain(meY, 0, areaH);
  
  gx = map(xc, 0, areaW, -canvasRad, canvasRad); //map constrained location on 0 - 100 to screen space
  gy = map(yc, 0, areaH, -canvasRad, canvasRad);
  
  /* -------------------- SOUNDS ---------------- */
  
  drawSounds(); 
  triggerSound(); 
  //console.log(audio[0].getVolume);
  
  /* -------------------- MAP AND HELPERS ------------- */
  var mapScale = 1.5;
  fill(0);
  textSize(12);
  //text('X = '+ round(xc), windowWidth - (areaW * mapScale), areaH * mapScale + 14); //location on 0 - 100
  //text('Y = '+ round(yc), windowWidth - (areaW*mapScale), areaH * mapScale + 28);//location on 0 - 100
  drawMap(-10, 10, xc, yc, 100, 100, mapScale);
  
  fill('#090909');
  //playButton.display();
  //playButton.x = windowWidth/2;
  //ellipse(windowWidth/2, windowHeight/2, 30, 30);
  
  
  
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
    stroke('#7F7F7F');
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
    /*if ( meX > interviewsX[i] - aD/2 && meX < interviewsX[i] + aD/2  ) {
      var panning = map(meX, interviewsX[i] - aD/2, interviewsX[i] + aD/2, 1.0, -1.0);
      audio[i].pan(panning);  
    }*/
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
  fill('#191919');
  rectMode(CORNER);
  rect(x + windowWidth - (w * scale), y, w * scale, h * scale);
  
  //sound sound location and playing radius
  for ( var i = 0; i < interviews.length; i += 3 ) {
    fill(0, 0, 255);
    noStroke();
    ellipse(x + windowWidth - areaW*scale + interviews[i]*scale, y + interviews[i + 1]*scale, 3, 3);
    noFill();
    stroke('#7F7F7F');
    ellipse(x + windowWidth - areaW*scale + interviews[i]*scale, y + interviews[i + 1]*scale, aD*scale, aD*scale); 
  }
  
  // draw me!
  fill('#f0f0f0');
  noStroke();
  var scaleW = map(mmeX, 0, areaW, -(w/2 * scale), w/2 * scale);
  var scaleH = map(mmeY, 0, areaH, -(h/2 * scale), h/2 * scale);
  ellipse(x + windowWidth - (w/2 * scale) + scaleW, y + (w/2 * scale) + scaleH, 5, 5);   
}

function StartButton(x, y, radius) {
  
  this.x = x;
  this.y = y;
  this.r = radius;
  this.col = color('red');
  
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
    this.col = color ('#red');
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