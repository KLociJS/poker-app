import { RefObject } from "react";
import { CanvasItem, DrawFn, EllipseProps } from "../_types/type";

export const drawBackground: DrawFn = (
  canvas: RefObject<HTMLCanvasElement>
) => {
  const ctx = canvas.current?.getContext("2d");

  if (ctx && canvas.current) {
    //Draw background
    ctx.fillStyle = "#D2D4C8";
    ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);

    //Draw table
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.current.width,
      canvas.current.height
    );

    gradient.addColorStop(0, "#242424"); // Start color
    gradient.addColorStop(1, "#2A2A2A"); // End color

    ctx.lineWidth = 30;
    ctx.strokeStyle = gradient;

    const ellipseProps = calculateEllipse(canvas);

    if (!ellipseProps) return;

    const { centerX, centerY, radiusX, radiusY } = ellipseProps;

    // Draw the outer ellipse
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.fillStyle = "#006600";

    // Draw the inner ellipse
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.fill();
  }
};

export const drawPlayer: DrawFn = (canvas: RefObject<HTMLCanvasElement>) => {
  const ctx = canvas.current?.getContext("2d");

  if (ctx) {
    const ellipseProps = calculateEllipse(canvas);
    if (!ellipseProps) return;
    const { centerX, centerY, radiusX, radiusY } = ellipseProps;

    const numberOfItems = 8;
    for (let i = 0; i < numberOfItems; i++) {
      const angle = (i / numberOfItems) * 2 * Math.PI; // Calculate the angle around the ellipse

      const width = 180;
      const height = 80;
      const radius = 10;
      const borderWidth = 1;

      // Calculate the position of the item around the ellipse circumference
      const x = centerX + radiusX * Math.cos(angle) - width / 2;
      const y = centerY + radiusY * Math.sin(angle) - height / 2;

      // Draw rounded border
      drawRoundedRectangle(
        x - borderWidth,
        y - borderWidth,
        width + 2 * borderWidth,
        height + 2 * borderWidth,
        radius,
        ctx
      );

      // Draw rounded rectangle
      ctx.fillStyle = "#333333";
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + width, y, x + width, y + height, radius);
      ctx.arcTo(x + width, y + height, x, y + height, radius);
      ctx.arcTo(x, y + height, x, y, radius);
      ctx.arcTo(x, y, x + width, y, radius);
      ctx.closePath();
      ctx.fill();
    }
  }
};

function drawRoundedRectangle(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  ctx: CanvasRenderingContext2D | null | undefined
) {
  if (ctx) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
  }
}

const calculateEllipse = (
  canvas: RefObject<HTMLCanvasElement>
): EllipseProps | undefined => {
  if (canvas.current) {
    const centerX = canvas.current.width / 2;
    const centerY = canvas.current.height / 2;
    const radiusX = Math.min((canvas.current.width * 0.8) / 2, 550); // Horizontal radius
    const radiusY = (canvas.current.height * 0.8) / 2; // Vertical radius

    return { centerX, centerY, radiusX, radiusY };
  }
};

export const reDrawCanvas = (canvasArr: CanvasItem[]) => {
  canvasArr.forEach((element) => {
    if (element.ref.current) {
      element.ref.current.width = window.innerWidth;
      element.ref.current.height = window.innerHeight - 100;
      element.drawFn(element.ref);
    }
  });
};
