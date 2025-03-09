import { MouseEvent, useEffect, useRef } from "react";
import drawingStore, { ShapeType } from "./stores/DrawingStore";
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
    }))
  );

  useEffect(() => {
    if (canvasRef.current) {
      drawingStore.setState({ canvasRef: canvasRef.current });

      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      const renderCtx = canvasRef.current.getContext("2d");
      if (renderCtx) {
        drawingStore.setState({ ctx: renderCtx });
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
    addShape({
      shapeType: ShapeType.BOX,
      x: startingPos.x,
      y: startingPos.y,
      width: event.clientX - startingPos.x,
      height: event.clientY - startingPos.y,
    });
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!isPaintMode) return;
    if (ctx === null) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    ctx.beginPath();
    ctx.rect(
      startingPos.x,
      startingPos.y,
      event.clientX - startingPos.x,
      event.clientY - startingPos.y
    );
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.stroke();

    shapes.forEach((shape) => {
      if (shape.shapeType == ShapeType.BOX) {
        ctx.beginPath();
        ctx.rect(shape.x, shape.y, shape.width, shape.height);
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.stroke();
      }
    });
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
      </div>
    </>
  );
}

export default App;
