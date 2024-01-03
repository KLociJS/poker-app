"use client";

import { RefObject, useEffect, useRef } from "react";

export default function Home() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvas.current) {
      canvas.current.width = window.innerWidth;
      canvas.current.height = window.innerHeight - 100;

      drawBackground(canvas);
    }

    const handleResize = () => {
      if (canvas.current) {
        canvas.current.width = window.innerWidth;
        canvas.current.height = window.innerHeight - 100;
        drawBackground(canvas);
      }
    };

    window.addEventListener("resize", handleResize);

    () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main>
      <canvas id='canvas' ref={canvas}></canvas>
    </main>
  );
}

const drawBackground = (canvas: RefObject<HTMLCanvasElement>) => {
  const ctx = canvas.current?.getContext("2d");

  if (ctx && canvas.current) {
    ctx.fillStyle = "#D2D4C8";
    ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);

    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.current.width,
      canvas.current.height
    );
    gradient.addColorStop(0, "#242424"); // Start color (slightly darker gray)
    gradient.addColorStop(1, "#2A2A2A"); // End color (darker gray)

    // Set the gradient as the stroke style for the ellipse
    ctx.lineWidth = 30;
    ctx.strokeStyle = gradient;

    const centerX = canvas.current.width / 2;
    const centerY = canvas.current.height / 2;
    const radiusX = Math.min((canvas.current.width * 0.8) / 2, 550); // Horizontal radius
    console.log(radiusX);
    const radiusY = (canvas.current.height * 0.8) / 2; // Vertical radius

    // Begin drawing the ellipse
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Set the gradient as the fill style for the inner ellipse
    ctx.fillStyle = "#006600";

    // Calculate the position of the inner ellipse (at the edge of the outer ellipse)
    const innerCenterX = centerX;
    const innerCenterY = centerY;
    const innerRadiusX = radiusX; // Adjust as needed
    const innerRadiusY = radiusY; // Adjust as needed

    // Draw the inner ellipse inside the gray one and fill it
    ctx.beginPath();
    ctx.ellipse(
      innerCenterX,
      innerCenterY,
      innerRadiusX,
      innerRadiusY,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill(); // Fill the inner ellipse with the green gradient
  }
};
