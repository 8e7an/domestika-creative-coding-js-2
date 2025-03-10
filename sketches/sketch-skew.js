// https://www.domestika.org/en/courses/3862-creative-coding-2-0-in-js-animation-sound-color/units/14951-skewing

const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  //animate: true,
};

const sketch = () => {

  let x, y, w, h;
  //let radius;
  let rx, ry, angle, degrees;

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    x = width * 0.5;
    y = height * 0.5;
    w = width * 0.6;
    h = height * 0.1;

    context.strokeStyle = 'blue';
    //context.save();

    /*
    // Basic rectangle 
    context.translate(x, y);
    context.strokeRect(w * -0.5, h * -0.5, w, h);
    */

    /*
    // Path rectangle 1
    context.translate(x, y);
    context.beginPath();
    context.moveTo(w * -0.5, h * -0.5);
    context.lineTo(w *  0.5, h * -0.5);
    context.lineTo(w *  0.5, h *  0.5);
    context.lineTo(w * -0.5, h *  0.5);
    context.closePath();
    context.stroke();
    */

    /*
    // Path rectangle 2
    context.translate(x, y);
    context.translate(w * -0.5, h * -0.5);
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(w, 0);
    context.lineTo(w, h);
    context.lineTo(0, h);
    context.closePath();
    context.stroke();
    */

    /*
    // Draw an angled line
    radius = 200;
    angle = math.degToRad(30);

    context.translate(x, y);

    x = Math.cos(angle) * radius;
    y = Math.sin(angle) * radius;

    context.beginPath()
    context.moveTo(0, 0);
    context.lineTo(x, y);
    context.stroke();
    */

    /*
    // Skewed rectangle
    angle = math.degToRad(30);
    //angle = math.degToRad(frame);
    rx = Math.cos(angle) * w;
    ry = Math.sin(angle) * w;
    context.translate(x, y);
    context.translate(rx * -0.5, (ry + h) * -0.5);
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(rx, ry);
    context.lineTo(rx, ry + h);
    context.lineTo(0, h);
    context.closePath();
    context.stroke();
    */

    //context.restore();

    context.translate(x, y);
    degrees = -45;
    w = 1024;
    h = 340;
    drawSkewedRect({ context, degrees });
    drawSkewedRect({ h, context, w, degrees });

    // Note with destructuring { ... } as the arguments to the function call
    // the variable names don't have to match the argument names - just
    // have to be the name name(s).

  };
};

  const drawSkewedRect = ({ context, w=600, h=200, degrees=45 }) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.save();
  context.translate(rx * -0.5, (ry + h) * -0.5);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();
  context.stroke();
  context.restore();
};

canvasSketch(sketch, settings);
