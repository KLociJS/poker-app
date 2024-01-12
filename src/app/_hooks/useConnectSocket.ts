import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  initSocket,
} from "../_utils/socket";

const useConnectSocket = () => {
  const [socket, setSocket] = useState<
    Socket<DefaultEventsMap, DefaultEventsMap> | undefined
  >(undefined);

  useEffect(() => {
    initSocket();
    connectSocket();

    const socket = getSocket();

    if (socket) {
      setSocket(socket);
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  return { socket };
};

export default useConnectSocket;
