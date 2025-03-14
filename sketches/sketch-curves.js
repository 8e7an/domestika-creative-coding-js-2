// https://www.domestika.org/en/courses/3862-creative-coding-2-0-in-js-animation-sound-color/units/14952-curves
// sketch-curves.js

const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = ({ width, height }) => {
  const drawCurves = true; // false draw lines
  const drawPoints = true;

  const cols = 12;
  const rows = 6;
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

  let x, y, n;
  let frequency = 0.002;
  let amplitude = 90;

  for (let i=0; i<numCells; i++) {
    x = (i % cols) * cw;
    y = Math.floor(i / cols) * ch;
    n = random.noise2D(x, y, frequency, amplitude);
    x += n;
    y += n;
    points.push(new Point({ x, y}));
  }

  return ({ context, width, height }) => {

    // Clear the canvas to black
    context.fillStyle = 'black'; context.fillRect(0, 0, width, height);

    context.save();
    context.translate(mx, my);
    context.translate(cw * 0.5, ch * 0.5);
    context.strokeStyle = 'red';
    context.strokeWidth = 4;

    //draw curves
    if (drawCurves) {
      for (let r=0; r<rows; r++) {
        context.beginPath();
        for (let c=0; c<cols-1; c++) {
          const curr = points[r * cols + c + 0];
          const next = points[r * cols + c + 1];
          const mx = curr.x + (next.x - curr.x) * 0.5;
          const my = curr.y + (next.y - curr.y) * 0.5;
          if (c == 0) context.moveTo(curr.x, curr.y);
          else if (c == cols -2) context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
          else context.quadraticCurveTo(curr.x, curr.y, mx, my);
        }
        context.stroke();
      }
    }
    //draw lines
    else {
      for (let r=0; r<rows; r++) {
        context.beginPath();
        for (let c=0; c<cols; c++) {
          const point = points[r * cols + c];
          if (!c) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        }
        context.stroke();
      }
    }

    //draw points
    if (drawPoints) {
      points.forEach((point) => {
        point.draw(context);
      });
    }

    context.restore();
  };
};

canvasSketch(sketch, settings);

class Point {
  static size = 10;
  constructor({ x, y, }) {
    this.x = x;
    this.y = y;
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(0, 0, Point.size, 0, Math.PI * 2);
    context.fill()
    context.restore();
  }
}
