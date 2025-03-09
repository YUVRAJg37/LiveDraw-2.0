import { create } from "zustand";

export enum DrawingMode {
  SHAPE,
  FREEHAND,
  ERASE,
}

export enum ShapeType {
  BOX,
  CIRCLE,
  LINE,
}

type Shape = {
  shapeType: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
};

interface IDrawingStore {
  canvasRef: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  startingPos: { x: number; y: number };
  setStartingPos: (pos: { x: number; y: number }) => void;
  isPaintMode: boolean;
  setPaintMode: (isPaintMode: boolean) => void;
  drawingMode: DrawingMode;
  shapeType: ShapeType;
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
  shapeType: ShapeType.BOX,
  shapes: [],
  addShape: (shape) => set((state) => ({ shapes: [...state.shapes, shape] })),
  clearShapes: () => set(() => ({ shapes: [] })),
}));

export default DrawingStore;
