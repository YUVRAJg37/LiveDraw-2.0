import { create } from "zustand";

export enum DrawingMode {
  SHAPE,
  FREEHAND,
  ERASE,
}

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

interface IDrawingStore {
  canvasRef: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  startingPos: { x: number; y: number };
  setStartingPos: (pos: { x: number; y: number }) => void;
  isPaintMode: boolean;
  setPaintMode: (isPaintMode: boolean) => void;
  drawingMode: DrawingMode;
  shapeType: ShapeType;
  setShapeType: (shapeType: ShapeType) => void;
  shapes: Shape[];
  addShape: (shape: Shape) => void;
  clearShapes: () => void;
}

const DrawingStore = create<IDrawingStore>((set) => ({
  canvasRef: null,
  ctx: null,
  startingPos: { x: 0, y: 0 },
  setStartingPos: (pos) => set(() => ({ startingPos: pos })),
  isPaintMode: false,
  setPaintMode: (value) => set(() => ({ isPaintMode: value })),
  drawingMode: DrawingMode.SHAPE,
  shapeType: ShapeType.ELLIPSE,
  setShapeType: (type) => set(() => ({ shapeType: type })),
  shapes: [],
  addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
  clearShapes: () => set(() => ({ shapes: [] })),
}));

export default DrawingStore;
