"use client";

import { SOCKET_EVENTS } from "@/app/_constants/constants";
import styles from "./index.module.css";

import PrimaryButton from "@/app/_components/button/PrimaryButton";
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

      socket.on("actionAnswer", (data: any) => {
        console.log("actionAnswer: ", data);
      });
    }
  }, [socket, params.tableId]);

  const call = () => {
    const playerId = getSessionStorageItem("playerId");
    const tableId = params.tableId;
    const action = { type: "call" };

    if (!socket) return;
    socket.emit(SOCKET_EVENTS.PLAYER_ACTION, { playerId, tableId, action });
  };
  const check = () => {
    const playerId = getSessionStorageItem("playerId");
    const tableId = params.tableId;
    const action = { type: "check", amount: 0 };

    if (!socket) return;
    socket.emit(SOCKET_EVENTS.PLAYER_ACTION, { playerId, tableId, action });
  };
  const raise = () => {
    const playerId = getSessionStorageItem("playerId");
    const tableId = params.tableId;
    const action = { type: "raise", amount: 100 };

    if (!socket) return;
    socket.emit(SOCKET_EVENTS.PLAYER_ACTION, { playerId, tableId, action });
  };
  const fold = () => {
    const playerId = getSessionStorageItem("playerId");
    const tableId = params.tableId;
    const action = { type: "fold", amount: 0 };

    if (!socket) return;
    socket.emit(SOCKET_EVENTS.PLAYER_ACTION, { playerId, tableId, action });
  };

  return (
    <>
      <main className={styles.container}>
        <div className={styles.test_buttons}>
          <PrimaryButton buttonText='call' clickHandler={call} />
          <PrimaryButton buttonText='check' clickHandler={check} />
          <PrimaryButton buttonText='raise' clickHandler={raise} />
          <PrimaryButton buttonText='fold' clickHandler={fold} />
        </div>
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
