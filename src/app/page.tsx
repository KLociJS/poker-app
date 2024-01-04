"use client";

import { RefObject, useEffect, useMemo, useRef } from "react";
import styles from "./index.module.css";
import { CanvasItem } from "./type";
import { drawBackground, drawPlayer, reDrawCanvas } from "./utils";

export default function Home() {
  const backgroundCanvas = useRef<HTMLCanvasElement>(null);
  const playerBackgroundCanvas = useRef<HTMLCanvasElement>(null);
  const gameInfoCanvas = useRef<HTMLCanvasElement>(null);

  const drawGameInfo = (canvas: RefObject<HTMLCanvasElement>) => {};

  const canvases: CanvasItem[] = useMemo(
    () => [
      { ref: backgroundCanvas, drawFn: drawBackground, id: 1 },
      { ref: playerBackgroundCanvas, drawFn: drawPlayer, id: 2 },
      { ref: gameInfoCanvas, drawFn: drawGameInfo, id: 3 },
    ],
    []
  );

  useEffect(() => {
    reDrawCanvas(canvases);

    const handleResize = (canvases: CanvasItem[]) => {
      reDrawCanvas(canvases);
    };

    window.addEventListener("resize", () => handleResize(canvases));

    () => {
      window.removeEventListener("resize", () => handleResize(canvases));
    };
  }, [canvases]);

  return (
    <>
      <main className={styles.container}>
        {canvases.map((canvas) => (
          <canvas
            key={canvas.id}
            ref={canvas.ref}
            className={styles.canvas}
          ></canvas>
        ))}
      </main>
    </>
  );
}
