// ITP Networked Media, Fall 2014
// https://github.com/shiffman/itp-networked-media
// Daniel Shiffman

// Keep track of our socket connection
var socket;
var c,color,sWeight,slider,radio,brushErase,clearBtn,saveBtn;
var cdate = new Date();
var time = cdate.getHours() + ":" + cdate.getMinutes() + ":" + cdate.getSeconds();

function setup() {
	if (typeof color !== 'undefined') {color=0;}
	var canvas = createCanvas(700, 800);
	canvas.parent('sketch-holder');
	background(255);
	c = createColorPicker('#000000');
	c.input(function() {
		color = c.color().toString('rgb');
		console.log(color);
	});
	c.parent('color-picker');

	slider = createSlider(2, 10, 2, 2);
  slider.style('width', '100px');
  slider.addClass('custom-range');
	slider.parent('stroke-weight');


	radio = createRadio();
	radio.parent('radio');
  radio.option('Кисть','brush');
  radio.option('Ластик','erase');
	radio._getInputChildrenArray()[0].checked = true;

	clearBtn = createButton('<i class="far fa-trash-alt"></i>');
  clearBtn.parent('clear-btn');
  clearBtn.addClass('btn btn-danger mr-2 rounded-pill');
  clearBtn.mousePressed(function() {
  	clear();
  	background(255);
  });

  saveBtn = createButton('<i class="far fa-save"></i>');
  saveBtn.parent('clear-btn');
  saveBtn.addClass('btn btn-success mr-2 rounded-pill');
  saveBtn.mousePressed(function() {
  	saveCanvas(canvas, 'myCanvas'+time, 'png');
  });

	// Start a socket connection to the server
	// Some day we would run this server somewhere else
	socket = io.connect('http://10.4.2.102:3000');
	// We make a named event called 'mouse' and write an
	// anonymous callback function
	socket.on('mouse',
		// When we receive data
		function(data) {
			// console.log("Got: " + data.x + " " + data.y);
			// Draw a blue circle
			stroke(data.col);
			strokeWeight(data.sweight);
			line(data.x, data.y,data.xp, data.yp);
		}
	);
}

function draw() {
	sWeight = slider.value();
	brushErase = radio.value();
}

function mouseDragged() {
	// Draw some white circles
	if (brushErase == "erase") {
		console.log(1);
		stroke(255);
	} else {
		stroke(color);
	}
	strokeWeight(sWeight);
	line(mouseX, mouseY, pmouseX, pmouseY);

	// Send the mouse coordinates
	sendmouse(mouseX,mouseY,pmouseX,pmouseY, color, sWeight);
}

// Function for sending to the socket
function sendmouse(xpos, ypos, xp, yp, myColor, mySWeight) {
	// We are sending!
	// console.log("sendmouse: " + xpos + " " + ypos);
	
	// Make a little object with  and y
	var data = {
		x: xpos,
		y: ypos,
		xp: xp,
		yp: yp,
		col: myColor,
		sweight: mySWeight
	};

	// Send that object to the socket
	socket.emit('mouse',data);
}
