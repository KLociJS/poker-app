"use client";

import { RefObject, useEffect, useMemo, useRef } from "react";
import styles from "./index.module.css";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  initSocket,
} from "./socket";
import { CanvasItem } from "./type";
import { drawBackground, drawPlayer, reDrawCanvas } from "./utils";

export default function Home() {
  const backgroundCanvas = useRef<HTMLCanvasElement>(null);
  const playerBackgroundCanvas = useRef<HTMLCanvasElement>(null);
  const gameInfoCanvas = useRef<HTMLCanvasElement>(null);

  const drawGameInfo = (canvas: RefObject<HTMLCanvasElement>) => {};

  useEffect(() => {
    initSocket();
    connectSocket();

    const socket = getSocket();
    if (socket) {
      socket.on("message", (message) => {
        console.log(message);
      });
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  const sendMessage = () => {
    const socket = getSocket();
    if (socket) {
      socket.emit("message", "Hello world!");
    }
  };

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
      <main className={styles.container} onClick={sendMessage}>
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
