"use client";

import { SOCKET_EVENTS } from "@/app/_constants/constants";
import useConnectSocket from "@/app/_hooks/useConnectSocket";
import { useEffect, useState } from "react";

import Styles from "./dashboard.module.css";

type Player = {
  id: string;
  name: string;
  chips: number;
};

type Game = {
  id: string;
  name: string;
  limit: number;
  stakes: string;
  maxPlayers: number;
  players: Player[];
};

const Dashboard = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

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

  const selectGame = (id: string) => {
    const selectedGame = games.find((game) => game.id === id);
    if (selectedGame) {
      setSelectedGame(selectedGame);
    }
  };

  return (
    <>
      <main className={Styles.main_container}>
        <div className={Styles.search_container}>
          <div className={Styles.input_container}>
            <label className={Styles.label} htmlFor='limit'>
              Limit
            </label>
            <select className={Styles.select} name='limit'>
              <option value='name' className={Styles.option}>
                Name
              </option>
              <option value='id' className={Styles.option}>
                ID
              </option>
            </select>
          </div>

          <div className={Styles.input_container}>
            <label className={Styles.label} htmlFor='stakes'>
              Stakes
            </label>
            <select className={Styles.select} name='stakes'>
              <option value='name'>Name</option>
              <option value='id'>ID</option>
            </select>
          </div>

          <div className={Styles.input_container}>
            <label className={Styles.label} htmlFor='max players'>
              Max players
            </label>
            <select className={Styles.select} name='max players'>
              <option value='name'>Name</option>
              <option value='id'>ID</option>
            </select>
          </div>
        </div>
        <div className={Styles.tables_container}>
          <table className={Styles.rooms_table}>
            <thead>
              <tr>
                <th>Table Name</th>
                <th>Limit</th>
                <th>Stakes</th>
                <th>Players</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id} onClick={() => selectGame(game.id)}>
                  <td>{game.name}</td>
                  <td>{game.limit}</td>
                  <td>{game.stakes}</td>
                  <td>{`${game.players.length} / ${game.maxPlayers}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={Styles.players_table_container}>
            {selectedGame && <h1>{selectedGame.name}</h1>}
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
