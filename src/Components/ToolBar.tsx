import { useShallow } from "zustand/shallow";
import DrawingStore, { DrawingMode } from "../stores/DrawingStore";
import { ShapeType } from "../Interfaces/Shape";

function ToolBar() {
  const { clearShapes, setShapeType, setDrawingMode, ctx } = DrawingStore(
    useShallow((state) => ({
      clearShapes: state.clearShapes,
      setShapeType: state.setShapeType,
      setDrawingMode: state.setDrawingMode,
      ctx: state.ctx,
    }))
  );

  const clearCanvas = () => {
    if (ctx === null) return;
    clearShapes();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  };

  return (
    <div>
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
        onClick={() => {
          setDrawingMode(DrawingMode.SHAPE);
          setShapeType(ShapeType.BOX);
        }}
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
        onClick={() => {
          setDrawingMode(DrawingMode.SHAPE);
          setShapeType(ShapeType.ELLIPSE);
        }}
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
        onClick={() => {
          setDrawingMode(DrawingMode.SHAPE);
          setShapeType(ShapeType.LINE);
        }}
      >
        Line
      </button>
      <button
        style={{
          position: "absolute",
          top: 250,
          left: 10,
          width: 100,
          height: 50,
        }}
        onClick={() => setDrawingMode(DrawingMode.FREEHAND)}
      >
        Draw
      </button>
    </div>
  );
}

export default ToolBar;
