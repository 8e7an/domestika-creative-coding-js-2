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
    new Point({ x:400, y:300, control:true }),
    new Point({ x:880, y:540 }),
  ];

  canvas.addEventListener('mousedown', onMouseDown);
  
  canvasElement = canvas;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
    //context.lineTo(880, 540);
    context.stroke();

    points.forEach((point) => point.draw(context));
  };
};

const onMouseDown = (evt) => {
  const { x, y } = getCanvasCalculatedPosition(evt);

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  points.forEach((point) => {
    point.isDragging = point.hitTest(x, y);
  });
};

const onMouseMove = (evt) => {
  const { x, y } = getCanvasCalculatedPosition(evt);

  //console.log(evt.x, evt.y);
  //console.log(evt.offsetX, evt.offsetY);
  //console.log(x, y);

  points.forEach((point) => {
    if (point.isDragging) {
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
