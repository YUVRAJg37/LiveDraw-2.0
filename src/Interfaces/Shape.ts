export enum ShapeType {
  BOX,
  ELLIPSE,
  LINE,
}

export interface Shape {
  shapeType: ShapeType;
  x: number;
  y: number;
}

export interface BoxShape extends Shape {
  width: number;
  height: number;
}

export interface EllipseShape extends Shape {
  radiusX: number;
  radiusY: number;
}

export interface LineShape extends Shape {
  endX: number;
  endY: number;
}
