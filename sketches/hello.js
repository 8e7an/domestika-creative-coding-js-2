// First tutorial of the Domestika video (with some tweaks)
//
// Run from Safari (default browser):
// canvas-sketch hello.js --open
//
// To run in Chrome have to copy use: 
// canvas-sketch hello.js
// and paste the URL (ie. http://172.20.10.3:9966/) into Chrome's address
// field.
//
// Set the (relative) path of the saved images/vidoes (setting
// savedimages to the location):
// canvas-sketch hello.js --output=savedimages
//
// Cmd + s to save the image locally.
//
// Canvas sketch documenation at Github:
// https://github.com/mattdesl/canvas-sketch
//

const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 800, 800 ],
  animate: true,
  fps: 60,
};

const sketch = ({ context, width, height }) => {

  // Setup values
  let x=0;
  let y=0;
  let f=true;

  context.fillStyle = 'lightblue';
  context.fillRect(0, 0, width, height);

  // With settings.animate true the following is executed each frame
  // (ie. once every 60 seconds.)
  return ({ context, width, height, frame }) => {

    if (frame > 136) return;

    x += 10;

	if (x > 460) {
		y += 240;
		x = 0;
	}

	/* 
	// it appears that this function can be called with 
	// frame being the same value (not updating each time)
	// so used the variable f to track changing on each frame.
    context.fillStyle = frame % 2 ? 'black' : 'white';
	context.strokeStyle = context.fillStyle;
	*/

	context.fillStyle = context.strokeStyle = (f = !f) ? 'black' : 'white';
	//f = !f

	// Draw a simple house

	// Set line width
	context.lineWidth = 10;

	// Wall
	context.strokeRect(x + 75, y + 140, 150, 110);

	// Door
	context.fillRect(x + 130, y + 190, 40, 60);

	// Roof
	context.beginPath();
	context.moveTo(x + 50, y + 140);
	context.lineTo(x + 150, y + 60);
	context.lineTo(x + 250, y + 140);
	context.closePath();
	context.stroke();
  };
};

canvasSketch(sketch, settings);
