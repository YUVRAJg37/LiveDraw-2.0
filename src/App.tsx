import { MouseEvent, useEffect, useRef } from "react";
import {
  ShapeType,
  BoxShape,
  EllipseShape,
  LineShape,
  Shape,
} from "./stores/DrawingStore";
import { useShallow } from "zustand/shallow";
import DrawingStore from "./stores/DrawingStore";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    ctx,
    isPaintMode,
    setPaintMode,
    startingPos,
    setStartingPos,
    addShape,
    shapes,
    clearShapes,
    shapeType,
    setShapeType,
  } = DrawingStore(
    useShallow((state) => ({
      ctx: state.ctx,
      isPaintMode: state.isPaintMode,
      setPaintMode: state.setPaintMode,
      startingPos: state.startingPos,
      setStartingPos: state.setStartingPos,
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
    setStartingPos(getMousePos(canvasRef.current, event));
  };

  const onMouseUp = (event: MouseEvent) => {
    setPaintMode(false);

    if (shapeType === ShapeType.BOX) {
      addShape({
        shapeType: shapeType,
        x: startingPos.x,
        y: startingPos.y,
        width: event.clientX - startingPos.x,
        height: event.clientY - startingPos.y,
      } as BoxShape);
    } else if (shapeType === ShapeType.ELLIPSE) {
      const radiusX = (event.clientX - startingPos.x) / 2;
      const radiusY = (event.clientY - startingPos.y) / 2;
      addShape({
        shapeType: shapeType,
        x: startingPos.x + radiusX,
        y: startingPos.y + radiusY,
        radiusX: Math.abs(radiusX),
        radiusY: Math.abs(radiusY),
      } as EllipseShape);
    } else if (shapeType === ShapeType.LINE) {
      addShape({
        shapeType: shapeType,
        x: startingPos.x,
        y: startingPos.y,
        endX: event.clientX,
        endY: event.clientY,
      } as LineShape);
    }
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!isPaintMode) return;
    if (ctx === null) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    let currentShape: Shape | null = null;
    if (shapeType === ShapeType.BOX) {
      const boxShape = {
        shapeType: shapeType,
        x: startingPos.x,
        y: startingPos.y,
        width: event.clientX - startingPos.x,
        height: event.clientY - startingPos.y,
      };
      currentShape = boxShape;
    } else if (shapeType === ShapeType.ELLIPSE) {
      const radiusX = (event.clientX - startingPos.x) / 2;
      const radiusY = (event.clientY - startingPos.y) / 2;
      const ellipseShape = {
        shapeType: shapeType,
        x: startingPos.x + radiusX,
        y: startingPos.y + radiusY,
        radiusX: Math.abs(radiusX),
        radiusY: Math.abs(radiusY),
      };
      currentShape = ellipseShape;
    } else if (shapeType === ShapeType.LINE) {
      const lineShape = {
        shapeType: shapeType,
        x: startingPos.x,
        y: startingPos.y,
        endX: event.clientX,
        endY: event.clientY,
      };
      currentShape = lineShape;
    }

    if (currentShape) DrawShape(currentShape);

    shapes.forEach((shape) => {
      DrawShape(shape);
    });
  };

  const DrawShape = (shape: Shape) => {
    if (ctx === null) return;

    ctx.beginPath();
    if (shape.shapeType == ShapeType.BOX) {
      const boxShape = shape as BoxShape;
      ctx.rect(boxShape.x, boxShape.y, boxShape.width, boxShape.height);
    } else if (shape.shapeType == ShapeType.ELLIPSE) {
      const ellipseShape = shape as EllipseShape;
      ctx.ellipse(
        ellipseShape.x,
        ellipseShape.y,
        ellipseShape.radiusX,
        ellipseShape.radiusY,
        0,
        0,
        2 * Math.PI
      );
    } else if (shape.shapeType == ShapeType.LINE) {
      const lineShape = shape as LineShape;
      ctx.moveTo(lineShape.x, lineShape.y);
      ctx.lineTo(lineShape.endX, lineShape.endY);
    }

    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const getMousePos = (canvas: HTMLCanvasElement, event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX ? event.clientX - rect.left : 0,
      y: event.clientY ? event.clientY - rect.top : 0,
    };
  };

  const clearCanvas = () => {
    if (ctx === null) return;
    clearShapes();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  };

  return (
    <>
      <div style={{ position: "relative" }}>
        <canvas
          ref={canvasRef}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
        ></canvas>
        <button
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            width: 100,
            height: 50,
          }}
          onClick={clearCanvas}
        >
          Clear
        </button>
        <button
          style={{
            position: "absolute",
            top: 70,
            left: 10,
            width: 100,
            height: 50,
          }}
          onClick={() => setShapeType(ShapeType.BOX)}
        >
          Box
        </button>
        <button
          style={{
            position: "absolute",
            top: 130,
            left: 10,
            width: 100,
            height: 50,
          }}
          onClick={() => setShapeType(ShapeType.ELLIPSE)}
        >
          Circle
        </button>
        <button
          style={{
            position: "absolute",
            top: 190,
            left: 10,
            width: 100,
            height: 50,
          }}
          onClick={() => setShapeType(ShapeType.LINE)}
        >
          Line
        </button>
      </div>
    </>
  );
}

export default App;
