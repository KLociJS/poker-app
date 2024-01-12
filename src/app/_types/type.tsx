import { RefObject } from "react";

export type DrawFn = (canvas: RefObject<HTMLCanvasElement>) => void;

export type CanvasItem = {
  id: number;
  ref: RefObject<HTMLCanvasElement>;
  drawFn: DrawFn;
};

export type EllipseProps = {
  centerX: number;
  centerY: number;
  radiusX: number;
  radiusY: number;
};
