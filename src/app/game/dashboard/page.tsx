"use client";

import { SOCKET_EVENTS } from "@/app/_constants/constants";
import useConnectSocket from "@/app/_hooks/useConnectSocket";
import { useEffect, useState } from "react";

type Player = {
  id: string;
  name: string;
  chips: number;
};

type Game = {
  id: string;
  name: string;
  maxPlayers: number;
  players: Player[];
};

const Dashboard = () => {
  const [games, setGames] = useState<Game[]>([]);
  const { socket } = useConnectSocket();

  useEffect(() => {
    if (socket) {
      socket.on(SOCKET_EVENTS.GET_GAMES, (games: Game[]) => {
        setGames(games);
      });
    }
  }, [socket]);

  const createGame = () => {
    socket?.emit(SOCKET_EVENTS.CREATE_GAME, {
      name: "test",
      maxPlayers: 2,
    });
  };

  return (
    <>
      <main>
        <h1>Dashboard</h1>
        <ul>
          {games.map((game) => (
            <li key={game.id}>{game.name}</li>
          ))}
        </ul>
        <button onClick={createGame}> Create game </button>
      </main>
    </>
  );
};

export default Dashboard;
