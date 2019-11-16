// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// Keep track of our socket connection
var socket;

function setup() {
  var canvas = createCanvas(400, 400);
  canvas.parent('sketch-holder');
  background(0);
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://draw-hack:3000');
  // We make a named event called 'mouse' and write an
  // anonymous callback function
  socket.on('mouse',
    // When we receive data
    function(data) {
      console.log("Got: " + data.x + " " + data.y);
      // Draw a blue circle
      fill(0,0,255);
      // noStroke();
      stroke(255);
      line(data.x, data.y,pmouseX, pmouseY);
    }
  );
}

function draw() {
  // Nothing
}

function mouseDragged() {
  // Draw some white circles
  fill(255);
  stroke(255);
  line(mouseX,mouseY,pmouseX, pmouseY);
  // Send the mouse coordinates
  sendmouse(mouseX,mouseY);
}

// Function for sending to the socket
function sendmouse(xpos, ypos) {
  // We are sending!
  console.log("sendmouse: " + xpos + " " + ypos);
  
  // Make a little object with  and y
  var data = {
    x: xpos,
    y: ypos
  };

  // Send that object to the socket
  socket.emit('mouse',data);
}
