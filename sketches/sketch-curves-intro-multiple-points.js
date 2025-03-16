// https://www.domestika.org/en/courses/3862-creative-coding-2-0-in-js-animation-sound-color/units/14952-curves
// sketch-curves-intro-multiple-points.js

const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

let canvasElement;
let points;

const sketch = ({ canvas }) => {

  points = [
    new Point({ x:200, y:540 }),
    new Point({ x:400, y:300 }),
    new Point({ x:880, y:540 }),
    new Point({ x:600, y:700 }),
    new Point({ x:640, y:900 }),
  ];

  canvas.addEventListener('mousedown', onMouseDown);
  
  canvasElement = canvas;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = '#999';
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (let i=0; i<points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.stroke();

    context.strokeStyle = 'blue';
    context.lineWidth = 4;
    context.beginPath();

    for (let i=0; i<points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const mx = curr.x + (next.x - curr.x) * 0.5;
      const my = curr.y + (next.y - curr.y) * 0.5;

      //context.arc(mx, my, 5, 0, Math.PI * 2);
      
      if (i == 0) context.moveTo(curr.x, curr.y);
      else if (i == points.length -2) context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
      else context.quadraticCurveTo(curr.x, curr.y, mx, my);
    }
    context.stroke();
    
    points.forEach((point) => point.draw(context));
  };
};

const onMouseDown = (evt) => {
  const { x, y } = getCanvasCalculatedPosition(evt);

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  // hit denotes an existing point has been clicked (and dragged)
  let hit = false
  points.forEach((point) => {
    point.isDragging = point.hitTest(x, y);
    if (!hit && point.isDragging) hit=true;
  });

  if (!hit) points.push(new Point({ x, y }));
};

const onMouseMove = (evt) => {
  const { x, y } = getCanvasCalculatedPosition(evt);

  //console.log(evt.x, evt.y);
  //console.log(evt.offsetX, evt.offsetY);
  //console.log(x, y);

  points.forEach((point) => {
    if (point.isDragging && evt.target == canvasElement) {
      point.x = x;
      point.y = y;
    }
  });
};

const onMouseUp = (evt) => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

const getCanvasCalculatedPosition = (evt) => {
  //const x = (evt.offsetX / canvasElement.offsetWidth) * canvasElement.width;
  //const y = (evt.offsetY / canvasElement.offsetHeight) * canvasElement.height;
  return { 
    x: (evt.offsetX / canvasElement.offsetWidth) * canvasElement.width,
    y: (evt.offsetY / canvasElement.offsetHeight) * canvasElement.height
  };
};

canvasSketch(sketch, settings);

class Point {
  static size = 10;
  isDragging = false;
  constructor({ x, y, control = false }) {
    this.x = x;
    this.y = y;
    this.control = control;
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.control ? 'red' : 'black';
    context.beginPath();
    context.arc(0, 0, Point.size, 0, Math.PI * 2);
    context.fill()
    context.restore();
  }
  hitTest(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dd = Math.sqrt(dx**2 + dy**2);
    return dd < Point.size * 2;
  }
}
