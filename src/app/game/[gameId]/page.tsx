"use client";

import styles from "./index.module.css";

import useCanvas from "@/app/_hooks/useCanvas";
import useConnectSocket from "@/app/_hooks/useConnectSocket";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";

const Game = () => {
  const { socket } = useConnectSocket();
  const { canvases } = useCanvas();

  const sendMessage = (
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  ) => {
    if (socket) {
      socket.emit("message", "Hello world!");
    }
  };

  return (
    <>
      <main className={styles.container} onClick={() => sendMessage(socket)}>
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
};

export default Game;
