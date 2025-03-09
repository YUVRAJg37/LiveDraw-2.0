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
import { EventStore } from "../stores/EventStore";
import { useCommonUtils, useMousePosition } from "../Utils/useCommonUtils";

function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { mousePos, setMousePos, setBoundingRect } = EventStore(
    useShallow((state) => ({
      mousePos: state.mousePos,
      setMousePos: state.setMousePos,
      setBoundingRect: state.setBoundingRect,
    }))
  );

  const { DrawBox, DrawEllipse, DrawLine } = useCommonUtils();
  const mousePosition = useMousePosition();
  const [startingPos, setStartingPos] = useState({ x: 0, y: 0 });

  console.log("test");

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

      setBoundingRect(canvasRef.current.getBoundingClientRect());

      const renderCtx = canvasRef.current.getContext("2d");
      if (renderCtx) {
        DrawingStore.setState({ ctx: renderCtx });
      }
    }
  }, [canvasRef]);

  const onMouseDown = () => {
    if (canvasRef.current === null) return;
    setPaintMode(true);
    setStartingPos(mousePosition);
    console.log(shapes);
  };

  const onMouseUp = () => {
    setPaintMode(false);
    const currentShape = GetCurrentShape();
    if (currentShape) addShape(currentShape);
    console.log(currentShape);
  };

  const onMouseMove = (Event: MouseEvent) => {
    setMousePos({ x: Event.clientX, y: Event.clientY });
    if (!isPaintMode) return;

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
          width: mousePos.x - startingPos.x,
          height: mousePos.y - startingPos.y,
        } as BoxShape;
      case ShapeType.ELLIPSE:
        const radiusX = (mousePos.x - startingPos.x) / 2;
        const radiusY = (mousePos.y - startingPos.y) / 2;
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
          endX: mousePos.x,
          endY: mousePos.y,
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
