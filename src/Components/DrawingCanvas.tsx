import { useShallow } from "zustand/shallow";
import {
  BoxShape,
  EllipseShape,
  LineShape,
  Shape,
  ShapeType,
} from "../Interfaces/Shape";
import { MouseEvent, useEffect, useRef, useState } from "react";
import DrawingStore, { DrawingMode } from "../stores/DrawingStore";

function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentStroke, setCurrentStroke] = useState<LineShape[]>([]);
  const [startingPos, setStartingPos] = useState({ x: 0, y: 0 });
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const currentShapeRef = useRef<Shape | null>(null);

  const {
    ctx,
    isPaintMode,
    setPaintMode,
    addShape,
    shapes,
    shapeType,
    drawingMode,
    strokes,
    setStrokes,
  } = DrawingStore(
    useShallow((state) => ({
      ctx: state.ctx,
      isPaintMode: state.isPaintMode,
      setPaintMode: state.setPaintMode,
      addShape: state.addShape,
      shapes: state.shapes,
      clearShapes: state.clearShapes,
      shapeType: state.shapeType,
      setShapeType: state.setShapeType,
      drawingMode: state.drawingMode,
      strokes: state.strokes,
      setStrokes: state.setStrokes,
    }))
  );

  useEffect(() => {
    if (canvasRef.current) {
      DrawingStore.setState({ canvasRef: canvasRef.current });

      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      const renderCtx = canvasRef.current.getContext("2d");
      if (renderCtx) {
        DrawingStore.setState({ ctx: renderCtx });
      }
    }
  }, [canvasRef]);

  const onMouseDown = (event: MouseEvent) => {
    if (canvasRef.current === null) return;
    setPaintMode(true);
    setStartingPos(GetMousePosition(event.clientX, event.clientY));

    if (drawingMode === DrawingMode.SHAPE) {
      const currentShape = GetCurrentShape();
      if (currentShape) {
        currentShapeRef.current = currentShape;
        addShape(currentShape);
      }
    }

    lastMousePositionRef.current = GetMousePosition(
      event.clientX,
      event.clientY
    );
  };

  const onMouseUp = () => {
    setPaintMode(false);

    currentShapeRef.current = null;
    setCurrentStroke([]);
    setStrokes([...strokes, currentStroke]);
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!isPaintMode) return;
    mousePositionRef.current = GetMousePosition(event.clientX, event.clientY);
    Draw();
    lastMousePositionRef.current = mousePositionRef.current;
  };

  const Draw = () => {
    if (ctx === null) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (drawingMode === DrawingMode.FREEHAND) {
      const currentShape = GetCurrentShape();
      if (currentShape) {
        setCurrentStroke([...currentStroke, currentShape as LineShape]);
      }
    } else {
      UpdateShapes();
    }

    shapes.forEach((shape) => {
      shape.draw(ctx);
    });

    strokes.forEach((stroke) => {
      stroke.forEach((line) => {
        line.draw(ctx);
      });
    });

    currentStroke.forEach((line) => {
      line.draw(ctx);
    });
  };

  const GetCurrentShape = () => {
    if (drawingMode !== DrawingMode.SHAPE) {
      return new LineShape(
        lastMousePositionRef.current.x,
        lastMousePositionRef.current.y,
        mousePositionRef.current.x,
        mousePositionRef.current.y
      );
    }

    switch (shapeType) {
      case ShapeType.BOX:
        return new BoxShape(
          startingPos.x,
          startingPos.y,
          mousePositionRef.current.x - startingPos.x,
          mousePositionRef.current.y - startingPos.y
        );
      case ShapeType.ELLIPSE:
        const radiusX = (mousePositionRef.current.x - startingPos.x) / 2;
        const radiusY = (mousePositionRef.current.y - startingPos.y) / 2;
        return new EllipseShape(
          startingPos.x + radiusX,
          startingPos.y + radiusY,
          Math.abs(radiusX),
          Math.abs(radiusY)
        );
      case ShapeType.LINE:
        return new LineShape(
          startingPos.x,
          startingPos.y,
          mousePositionRef.current.x,
          mousePositionRef.current.y
        );
      default:
    }
  };

  const UpdateShapes = () => {
    if (currentShapeRef.current instanceof BoxShape) {
      currentShapeRef.current.setBounds(
        startingPos.x,
        startingPos.y,
        mousePositionRef.current.x - startingPos.x,
        mousePositionRef.current.y - startingPos.y
      );
      return;
    }

    if (currentShapeRef.current instanceof EllipseShape) {
      const radiusX = (mousePositionRef.current.x - startingPos.x) / 2;
      const radiusY = (mousePositionRef.current.y - startingPos.y) / 2;
      currentShapeRef.current.setBounds(
        startingPos.x + radiusX,
        startingPos.y + radiusY,
        Math.abs(radiusX),
        Math.abs(radiusY)
      );
      return;
    }

    if (currentShapeRef.current instanceof LineShape) {
      currentShapeRef.current.setBounds(
        startingPos.x,
        startingPos.y,
        mousePositionRef.current.x,
        mousePositionRef.current.y
      );
      return;
    }
  };

  const GetMousePosition = (clientX: number, clientY: number) => {
    if (canvasRef.current === null) return { x: 0, y: 0 };

    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
    ></canvas>
  );
}

export default DrawingCanvas;
