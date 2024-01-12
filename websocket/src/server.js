const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { SOCKET_EVENTS } = require("./constants/actions");
const { createGame, joinGame, getGames } = require("./actions/socketAction");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
  console.log("user connected");

  // Send all games to the client when they connect
  socket.emit(SOCKET_EVENTS.UPDATE_GAMES, getGames());

  // Listen for create game event
  socket.on(SOCKET_EVENTS.CREATE_GAME, (game) => {
    createGame(game.name, game.creator);
    io.emit(SOCKET_EVENTS.UPDATE_GAMES, getGames());
  });

  // Listen for join game event
  socket.on(SOCKET_EVENTS.JOIN_GAME, (joinRequest) => {
    const isSuccessful = joinGame(joinRequest);

    if (isSuccessful) {
      io.emit(SOCKET_EVENTS.UPDATE_GAMES, getGames());
    } else {
      io.emit(SOCKET_EVENTS.JOIN_GAME_FAILED);
    }
  });

  // Listen for disconnect event
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(3001, () => {
  console.log("listening on *:3001");
});
