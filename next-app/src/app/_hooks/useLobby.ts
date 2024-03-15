import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ROUTES, SOCKET_EVENTS } from "../_constants/constants";
import { Table } from "../_types/type";
import useConnectSocket from "./useConnectSocket";

function useLobby(isRegistrationSuccessful: boolean, userName: string) {
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const { socket } = useConnectSocket();
  const router = useRouter();

  useEffect(() => {
    if (isRegistrationSuccessful && socket) {
      socket.emit(SOCKET_EVENTS.JOIN_LOBBY, { userName });

      socket.on(SOCKET_EVENTS.GET_TABLES, (tables: Table[]) => {
        setTables(tables);
      });

      socket.on(SOCKET_EVENTS.UPDATE_LOBBY_TABLES, (tables: Table[]) => {
        setTables(tables);
      });

      socket.on(SOCKET_EVENTS.GET_PLAYERID, (playerId: string) => {
        sessionStorage.setItem("playerId", playerId);
      });

      socket.on(SOCKET_EVENTS.TABLE_IS_FULL, (tableId: string) => {
        console.log("tableIsFull", tableId);
      });
    }
  }, [isRegistrationSuccessful, socket, userName]);

  const selectTable = (id: string) => {
    const selectedTable = tables.find((table) => table.id === id);
    if (selectedTable) {
      setSelectedTable(selectedTable);
    }
  };

  const joinTable = (tableId: string | undefined) => {
    if (tableId === undefined) return;
    router.push(`${ROUTES.TABLE.HREF}${tableId}`);
  };

  return {
    tables,
    selectedTable,
    selectTable,
    joinTable,
  };
}

export default useLobby;
