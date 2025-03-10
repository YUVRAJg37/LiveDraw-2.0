import { create } from "zustand";
import { LineShape, Shape, ShapeType } from "../Interfaces/Shape";

export enum DrawingMode {
  SHAPE,
  FREEHAND,
  ERASE,
}

interface IDrawingStore {
  canvasRef: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  isPaintMode: boolean;
  setPaintMode: (isPaintMode: boolean) => void;
  drawingMode: DrawingMode;
  setDrawingMode: (mode: DrawingMode) => void;
  shapeType: ShapeType;
  setShapeType: (shapeType: ShapeType) => void;
  shapes: Shape[];
  addShape: (shape: Shape) => void;
  clearShapes: () => void;
  strokes: LineShape[][];
  setStrokes: (strokes: LineShape[][]) => void;
}

const DrawingStore = create<IDrawingStore>((set) => ({
  canvasRef: null,
  ctx: null,
  isPaintMode: false,
  setPaintMode: (value) => set(() => ({ isPaintMode: value })),
  drawingMode: DrawingMode.SHAPE,
  setDrawingMode: (mode) => set(() => ({ drawingMode: mode })),
  shapeType: ShapeType.ELLIPSE,
  setShapeType: (type) => set(() => ({ shapeType: type })),
  shapes: [],
  addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
  clearShapes: () => set(() => ({ shapes: [], strokes: [] })),
  strokes: [],
  setStrokes: (strokes) => set(() => ({ strokes })),
}));

export default DrawingStore;
