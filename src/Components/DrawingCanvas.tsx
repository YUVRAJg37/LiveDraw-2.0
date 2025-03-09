import { useShallow } from "zustand/shallow";
import {
  BoxShape,
  EllipseShape,
  LineShape,
  Shape,
  ShapeType,
} from "../Interfaces/Shape";
import { MouseEvent, useEffect, useRef, useState } from "react";
import DrawingStore from "../stores/DrawingStore";
import { useCommonUtils } from "../Utils/useCommonUtils";

function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { DrawBox, DrawEllipse, DrawLine } = useCommonUtils();
  const [startingPos, setStartingPos] = useState({ x: 0, y: 0 });
  const mousePositionRef = useRef({ x: 0, y: 0 });

  const { ctx, isPaintMode, setPaintMode, addShape, shapes, shapeType } =
    DrawingStore(
      useShallow((state) => ({
        ctx: state.ctx,
        isPaintMode: state.isPaintMode,
        setPaintMode: state.setPaintMode,
        addShape: state.addShape,
        shapes: state.shapes,
        clearShapes: state.clearShapes,
        shapeType: state.shapeType,
        setShapeType: state.setShapeType,
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
  };

  const onMouseUp = () => {
    setPaintMode(false);
    const currentShape = GetCurrentShape();
    if (currentShape) addShape(currentShape);
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!isPaintMode) return;
    mousePositionRef.current = GetMousePosition(event.clientX, event.clientY);
    Draw();
  };

  const Draw = () => {
    if (ctx === null) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const currentShape = GetCurrentShape();

    if (currentShape) DrawShape(currentShape);

    shapes.forEach((shape) => {
      DrawShape(shape);
    });
  };

  const GetCurrentShape = () => {
    switch (shapeType) {
      case ShapeType.BOX:
        return {
          shapeType: shapeType,
          x: startingPos.x,
          y: startingPos.y,
          width: mousePositionRef.current.x - startingPos.x,
          height: mousePositionRef.current.y - startingPos.y,
        } as BoxShape;
      case ShapeType.ELLIPSE:
        const radiusX = (mousePositionRef.current.x - startingPos.x) / 2;
        const radiusY = (mousePositionRef.current.y - startingPos.y) / 2;
        return {
          shapeType: shapeType,
          x: startingPos.x + radiusX,
          y: startingPos.y + radiusY,
          radiusX: Math.abs(radiusX),
          radiusY: Math.abs(radiusY),
        } as EllipseShape;
      case ShapeType.LINE:
        return {
          shapeType: shapeType,
          x: startingPos.x,
          y: startingPos.y,
          endX: mousePositionRef.current.x,
          endY: mousePositionRef.current.y,
        } as LineShape;
      default:
    }
  };

  const DrawShape = (shape: Shape) => {
    if (ctx === null) return;

    ctx.beginPath();

    switch (shape.shapeType) {
      case ShapeType.BOX:
        DrawBox(shape as BoxShape);
        break;
      case ShapeType.ELLIPSE:
        DrawEllipse(shape as EllipseShape);
        break;
      case ShapeType.LINE:
        DrawLine(shape as LineShape);
        break;
      default:
    }

    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.stroke();
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
