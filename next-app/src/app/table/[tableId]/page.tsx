"use client";

import { SOCKET_EVENTS } from "@/app/_constants/constants";
import styles from "./index.module.css";

import useCanvas from "@/app/_hooks/useCanvas";
import useConnectSocket from "@/app/_hooks/useConnectSocket";
import { Table } from "@/app/_types/type";
import { getSessionStorageItem } from "@/app/_utils/sessionStorage";
import { useEffect } from "react";

const Game = ({ params }: { params: { tableId: string } }) => {
  const { socket } = useConnectSocket();
  const { canvases } = useCanvas();

  useEffect(() => {
    const playerId = getSessionStorageItem("playerId");

    if (socket && playerId) {
      const joinTableData = {
        tableId: params.tableId,
        playerId: playerId,
      };

      socket.emit(SOCKET_EVENTS.JOIN_TABLE, joinTableData);

      socket.on(SOCKET_EVENTS.UPDATE_TABLE, (table: Table) => {
        console.log("table", table);
      });
    }
  }, [socket, params.tableId]);

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
};

export default Game;
