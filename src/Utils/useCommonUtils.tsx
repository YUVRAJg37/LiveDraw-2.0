import { useShallow } from "zustand/shallow";
import { BoxShape, EllipseShape, LineShape } from "../Interfaces/Shape";
import DrawingStore from "../stores/DrawingStore";

interface ICommonUtils {
  DrawBox: (box: BoxShape) => void;
  DrawEllipse: (ellipse: EllipseShape) => void;
  DrawLine: (line: LineShape) => void;
}

export const useCommonUtils = (): ICommonUtils => {
  const { ctx } = DrawingStore(
    useShallow((state) => ({
      ctx: state.ctx,
    }))
  );
  const DrawBox = (box: BoxShape) => {
    if (ctx === null) return;
    ctx.rect(box.x, box.y, box.width, box.height);
  };
  const DrawEllipse = (ellipse: EllipseShape) => {
    if (ctx === null) return;
    ctx.ellipse(
      ellipse.x,
      ellipse.y,
      ellipse.radiusX,
      ellipse.radiusY,
      0,
      0,
      2 * Math.PI
    );
  };
  const DrawLine = (line: LineShape) => {
    if (ctx === null) return;
    ctx.moveTo(line.x, line.y);
    ctx.lineTo(line.endX, line.endY);
  };

  return { DrawBox, DrawEllipse, DrawLine };
};
