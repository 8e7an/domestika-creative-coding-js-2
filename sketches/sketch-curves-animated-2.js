// https://www.domestika.org/en/courses/3862-creative-coding-2-0-in-js-animation-sound-color/units/14952-curves
// sketch-curves-animated.js
//
// CMD + SHIFT + s to save output to MP4 file.
// This uses the (installed) ffmpeg installer node module:
// https://www.npmjs.com/package/@ffmpeg-installer/ffmpeg
// From the Terminal use the command:
// canvas-sketch sketch-curves-animated --output=output/curves --stream
//

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Color = require('canvas-sketch-util/color');
// https://github.com/bpostlethwaite/colormap
const colormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const sketch = ({ width, height }) => {
  const showDotsAndLines = true;
  const drawPoints = true;

  const cols = 72;
  const rows = 8;
  const numCells = cols * rows;

  // grid
  const gw = width * 0.8;
  const gh = height * 0.8;
  // cells
  const cw = gw / cols;
  const ch = gh / rows;
  // margins
  const mx = (width - gw) * 0.5;
  const my = (height - gh) * 0.5;

  const points = [];

  let x, y, n, lineWidth, color;
  let frequency = 0.002;
  let amplitude = 75;
  let colors = colormap({
    colormap: 'copper',
    nshades: amplitude,
  });

  for (let i=0; i<numCells; i++) {
    x = (i % cols) * cw;
    y = Math.floor(i / cols) * ch;
    n = random.noise2D(x, y, frequency, amplitude);
    lineWidth = math.mapRange(n, -amplitude, amplitude, 0, 6);
    dotRadius = math.mapRange(n, -amplitude, amplitude, 3, 12);
    colorLine = colors[Math.floor(math.mapRange(n, -amplitude, amplitude, 0, amplitude))];
    colorDot = Color.offsetHSL(colorLine, 0, 0, +10).hex;
    points.push(new Point({ x, y, lineWidth, colorLine, colorDot, dotRadius }));
  }

  return ({ context, width, height, frame }) => {

    // Clear the canvas to black
    context.fillStyle = 'black'; context.fillRect(0, 0, width, height);

    let lastx = 0;
    let lasty = 0;

    context.save();
    context.translate(mx, my);
    context.translate(cw * 0.5, ch * 0.5);

    // Update positions
    points.forEach((point) => {
      n = random.noise2D(point.ix + frame * 3, point.iy, frequency, amplitude);
      point.x = point.ix + n;
      point.y = point.iy + n;
    });

    // Draw points
    if (showDotsAndLines && drawPoints) {
      points.forEach((point) => {
        point.draw(context);
      });
    }

    // Draw curves based on Point objects in the points array
    for (let r=0; r<rows; r++) {
      for (let c=0; c<cols-1; c++) {
        const curr = points[r * cols + c + 0];
        const next = points[r * cols + c + 1];
        const mx = curr.x + (next.x - curr.x) * -2.4;
        const my = curr.y + (next.y - curr.y) * -8.5;
        
        // If it's the first cell in the row set the last x
        // and last y to the current cells x and y values
        if (c === 0) { 
          lastx = curr.x;
          lasty = curr.y; 
        }
        // Skip drawing the first curve as it doesn't have
        // consistent quadratic curve values to the others
        // (last each row is also not drawn)
        else { 
          context.beginPath();
          context.lineWidth = curr.lineWidth;
          context.strokeStyle = curr.colorLine;
          context.moveTo(lastx, lasty);
          context.quadraticCurveTo(curr.x, curr.y, mx, my);
          context.stroke();
        }

        if (showDotsAndLines) {
          context.lineWidth = 2;
          context.beginPath()
          context.moveTo(mx, my)
          context.strokeStyle = next.colorLine;
          context.lineTo(next.x, next.y);
          context.stroke()
          curveStartPointDraw(context, mx, my, next.colorLine);
        }

        lastx = mx - c / cols + 250; 
        lasty = my - r / rows + 150; 

      }
    }

    context.restore();
  };
};

canvasSketch(sketch, settings);

class Point {
  constructor({ x, y, lineWidth, colorLine, colorDot, dotRadius }) {
    this.x = x;
    this.y = y;
    this.lineWidth = lineWidth;
    this.colorLine = colorLine;
    this.colorDot = colorDot;
    this.dotRadius = dotRadius;
    this.ix = x;
    this.iy = y;
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.colorDot;
    context.beginPath();
    context.arc(0, 0, this.dotRadius, 0, Math.PI * 2);
    context.fill()
    context.restore();
  }
}

function curveStartPointDraw(context, x, y, color) {
  context.save();
  context.translate(x, y);
  context.fillStyle = Color.offsetHSL(color, 0, 0, +5).hex;
  context.beginPath();
  context.arc(0, 0, 5, 0, Math.PI * 2);
  context.fill()
  context.restore();
}
