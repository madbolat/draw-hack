var socket;
var slider,radio,color,strWeight,radioBool,eraser=false;

function setup() {
	//Canvas
	var canvas = createCanvas(700, 800);
	canvas.parent('sketch-holder');
	background(255);
	//Color Picker
	if (typeof color !== 'undefined') {color=0;}
	var colorPicker = createColorPicker('#000000');
	colorPicker.input(function() {
		color = colorPicker.color().toString('rgb');
	});
	colorPicker.parent('color-picker');
	//strokeWeight
	slider = createSlider(2, 10, 2, 2);
	slider.style('width', '100px');
	slider.addClass('custom-range');
	slider.parent('stroke-weight');
	//Radio -> [Brush, Eraser]
	radio = createRadio();
	radio.parent('radio');
	radio.option('Кисть','brush');
	radio.option('Ластик','erase');
	radio._getInputChildrenArray()[0].checked = true;
	//Clear Canvas Button
	var clearBtn = createButton('<i class="far fa-trash-alt"></i>');
	clearBtn.parent('clear-btn');
	clearBtn.addClass('btn btn-danger mr-2 rounded-pill');
	clearBtn.mousePressed(clearCanvas);
	//Save Canvas Button
	var saveBtn = createButton('<i class="far fa-save"></i>');
	saveBtn.parent('clear-btn');
	saveBtn.addClass('btn btn-success mr-2 rounded-pill');
	saveBtn.mousePressed(function() {
		saveCanvas(canvas, 'myCanvas', 'png');
	});

	// Start a socket connection to the server
	socket = io.connect('http://draw-hack:3000');
	socket.on('mouse',
		function(data) {
			if (data.eraser) {
				stroke(255);
			} else {
				stroke(data.col);
			}
			strokeWeight(data.sWeight);
			line(data.x, data.y,data.xp, data.yp);
		}
	);
	socket.on('clearCanvas',
		function(data) {
			clear();
			background(255);
		}
	);
}

function draw() {
	strWeight = slider.value();
	radioBool = radio.value();
}

function clearCanvas() {
	clear();
	background(255);
	socket.emit('clearCanvas', {clear: true});
}

function mouseDragged() {
	if (radioBool == "erase") {
		eraser=true;
		stroke(255);
	} else {
		eraser=false;
		stroke(color);
	}
	strokeWeight(strWeight);
	line(mouseX, mouseY, pmouseX, pmouseY);

	// Send the mouse settings
	sendSet(mouseX,mouseY,pmouseX,pmouseY,color,strWeight,eraser);
}

// Function for sending to the socket
function sendSet(xpos, ypos, xp, yp, myColor, myStrokeWeight, eraser) {
	var data = {
		x: xpos,
		y: ypos,
		xp: xp,
		yp: yp,
		col: myColor,
		sWeight: myStrokeWeight,
		eraser: eraser
	};
	socket.emit('mouse',data);
}