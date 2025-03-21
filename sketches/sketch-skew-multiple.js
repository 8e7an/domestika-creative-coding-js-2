// https://www.domestika.org/en/courses/3862-creative-coding-2-0-in-js-animation-sound-color/units/14951-skewing
// Continuation of Unit 3 with multiple skewed rectangles

const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const Color = require('canvas-sketch-util/color');
const risoColors = require('riso-colors');

const settings = {
  dimensions: [ 1080, 1080 ],
  //animate: true,
};

const sketch = ({ context, width, height }) => {

  const nums = 40; //20;
  const rects = [];
  const rectColors = [
    random.pick(risoColors),
    random.pick(risoColors),
    //random.pick(risoColors),
  ];
  const bgColor = random.pick(risoColors).hex;

  let x, y, w, h, fill, stroke, lineWidth, blendMode;
  let degrees = -30;

  //
  for (let i=0; i<nums; i++) {
    x = random.range(0, width);
    y = random.range(0, height);
    w = random.range(600, width); //random.range(200, 400);
    h = random.range(40, 200);
    lineWidth = random.range(8, 24);

    blendMode = random.value() > 0.5 ? 'overlay' : 'source-over';

    //fill = `rgba(${random.range(0, 255)}, ${random.range(0, 255)}, ${random.range(0, 255)})`;
    //fill = random.pick(risoColors).hex;
    fill = random.pick(rectColors).hex;
    //stroke = 'black';
    //stroke = random.pick(risoColors).hex;
    stroke = random.pick(rectColors).hex;

    rects.push({ x, y, w, h, fill, stroke, lineWidth, blendMode });
  }

  return ({ context, width, height }) => {

    // Clear the canvas
    context.fillStyle = bgColor; context.fillRect(0, 0, width, height);

    rects.forEach((rect) => {
      const { x, y, w, h, fill, stroke, lineWidth, blendMode } = rect;

      context.save();

      context.translate(x, y);

      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = lineWidth;

      context.globalCompositeOperation = blendMode;

      drawSkewedRect({ context, w, h, degrees });

      // Convert the fill color to a HSL value with a lower luminance (to make darker)
      shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.5; // Set the alpha value to 50%

      context.shadowColor = Color.style(shadowColor.rgba);
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;
      context.fill();

      context.shadowColor = null;
      context.stroke();

      context.globalCompositeOperation = 'source-over';

      context.lineWidth = 2;
      context.strokeStyle = 'black';
      context.stroke();

      context.restore();
    });

  };
};

const drawSkewedRect = ({ context, w=600, h=200, degrees=45 }) => {
  const angle = math.degToRad(degrees);
  const rx = Math.cos(angle) * w;
  const ry = Math.sin(angle) * w;

  context.translate(rx * -0.5, (ry + h) * -0.5);
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();
};

canvasSketch(sketch, settings);

