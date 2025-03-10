export enum ShapeType {
  BOX,
  ELLIPSE,
  LINE,
}

export class Shape {
  x: number;
  y: number;
  lineWidth: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.lineWidth = 4;
  }

  draw(ctx: CanvasRenderingContext2D) {
    throw new Error("draw() method must be implemented in subclasses");
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setBounds(...args: any[]) {
    throw new Error("setBound() method must be implemented in subclasses");
  }

  setLineWidth(width: number) {
    this.lineWidth = width;
  }
}

export class BoxShape extends Shape {
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y);
    this.width = width;
    this.height = height;
  }

  override draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.lineWidth = this.lineWidth;
    ctx.stroke();
  }

  override setBounds(x: number, y: number, width: number, height: number) {
    this.setPosition(x, y);
    this.width = width;
    this.height = height;
  }
}

export class EllipseShape extends Shape {
  radiusX: number;
  radiusY: number;

  constructor(x: number, y: number, radiusX: number, radiusY: number) {
    super(x, y);
    this.radiusX = radiusX;
    this.radiusY = radiusY;
  }

  override draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
    ctx.lineWidth = this.lineWidth;
    ctx.stroke();
  }

  override setBounds(x: number, y: number, radiusX: number, radiusY: number) {
    this.setPosition(x, y);
    this.radiusX = radiusX;
    this.radiusY = radiusY;
  }
}

export class LineShape extends Shape {
  endX: number;
  endY: number;

  constructor(x: number, y: number, endX: number, endY: number) {
    super(x, y);
    this.endX = endX;
    this.endY = endY;
  }

  override draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.endX, this.endY);
    ctx.lineWidth = this.lineWidth;
    ctx.stroke();
  }

  override setBounds(x: number, y: number, endX: number, endY: number) {
    this.setPosition(x, y);
    this.endX = endX;
    this.endY = endY;
  }
}
