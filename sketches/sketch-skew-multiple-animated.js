// https://www.domestika.org/en/courses/3862-creative-coding-2-0-in-js-animation-sound-color/units/14951-skewing
// Variation of Unit 3 with multiple skewed rectangles but also animated

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

  const nums = 1;
  const rects = [];
  const rectColors = [
    random.pick(risoColors),
    random.pick(risoColors),
    random.pick(risoColors),
  ];
  const bgColor = random.pick(risoColors).hex;

  let x, y, w, h, fill, stroke, lineWidth, blendMode, midx, midy;
  let degrees = -30;

  //
  for (let i=0; i<nums; i++) {
    x = midx = random.range(0, width);
    y = midy = random.range(0, height);
    w = random.range(600, width); //random.range(200, 400);
    h = random.range(40, 200);
    lineWidth = random.range(8, 24);
    blendMode = random.value() > 0.5 ? 'overlay' : 'source-over';
    fill = random.pick(rectColors).hex;
    stroke = random.pick(rectColors).hex;
    rects.push({ x, y, w, h, fill, stroke, lineWidth, blendMode, midx, midy });
  }

  return ({ context, width, height }) => {

    // Clear the canvas
    context.fillStyle = bgColor; context.fillRect(0, 0, width, height);

    const angle = math.degToRad(degrees);

    rects.forEach((rect) => {
      const { x, y, w, h, fill, stroke, lineWidth, blendMode, midx, midy } = rect;

      context.save();

      context.translate(x, y);

      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = lineWidth;

      context.globalCompositeOperation = blendMode;

      drawSkewedRect({ context, w, h, degrees });

      // Convert the fill color to a HSL value with a lower luminance (to make darker)
      //shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      //shadowColor.rgba[3] = 0.5; // Set the alpha value to 50%

      //context.shadowColor = Color.style(shadowColor.rgba);
      //context.shadowOffsetX = -10;
      //context.shadowOffsetY = 20;

      // Fill the rectangle (shadow applied)
      context.fill();

      //context.shadowColor = null;

      // Stroke the rectangle (shadow not applied)
      context.stroke();

      context.globalCompositeOperation = 'source-over';

      /*
      // Black thin outline
      context.lineWidth = 2;
      context.strokeStyle = 'black';
      context.stroke();
      */

      context.restore();




      // let rx = Math.cos(angle) * dist;
      // let ry = Math.sin(angle) * dist;
      // let rxh = rx * 0.5;
      // let offsetWidth = (width - dirx) + rxh;
      // let offsetHeight = ry + (Math.tan(angle) * offsetWidth);




      // Rectangle is beyond the left side of the canvas 
      if (rect.x + Math.ceil(Math.cos(angle) * w * 0.5) + lineWidth < 0) {
        //debugger
        rect.x = width + Math.ceil(Math.cos(angle) * w * 0.5); 
        rect.y = 0; //Math.sin(angle) * width;
      }
      // Rectangle is beyond the right side of the canvas 
      //else if (rect.x > width) {
      //  rect.x = 0;
      //}
      // Update the rectangle x and y properties to move by the calculated
      // amount
      else {

        let dist = 5;
        let dirx = -1;
        let diry = -1;
        let rx = Math.cos(angle) * dist;
        let ry = Math.sin(angle) * dist;

        rect.x += dirx * rx;
        rect.y += diry * ry;
      }

      drawCircle({ context, midx, midy });

    });

  };
};

// Rectangle path
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

// Small circle
const drawCircle = ({ context, midx, midy }) => {
  //context.save();
  context.fillStyle = 'navy';
  context.beginPath();
  context.strokeStyle = null;
  context.arc(midx, midy, 10, 0, Math.PI * 2);
  context.fill();
  context.closePath();
  //context.stroke();
  //context.restore();
};

canvasSketch(sketch, settings);

