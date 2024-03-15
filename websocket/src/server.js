const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const { SOCKET_EVENTS } = require("./constants/socketEvents");
const InitPokerLobby = require("./classes/pokerLobby");
const {
  handleJoinLobbyEvent,
  handleJoinTableEvent,
  handlePlayerAction,
} = require("./handlers/socketEventHandlers");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000" },
});

let pokerLobby = InitPokerLobby();

io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
  socket.on(SOCKET_EVENTS.JOIN_LOBBY, (data) =>
    handleJoinLobbyEvent(data, socket, pokerLobby)
  );

  socket.on(SOCKET_EVENTS.JOIN_TABLE, (data) => {
    handleJoinTableEvent(data, socket, io, pokerLobby);
  });

  socket.on(SOCKET_EVENTS.PLAYER_ACTION, (data) => {
    handlePlayerAction(data, socket, io, pokerLobby);
  });

  //Debugging rooms
  // io.of("/").adapter.on("create-room", (room) => {
  //   console.log(`room ${room} was created`);
  // });

  // io.of("/").adapter.on("join-room", (room, id) => {
  //   console.log(`socket ${id} has joined room ${room}`);
  // });

  // io.of("/").adapter.on("leave-room", (room, id) => {
  //   console.log(`socket ${id} has left room ${room}`);
  // });

  socket.on(SOCKET_EVENTS.DISCONNECT, () => {
    console.log("user disconnected");
    socket.leave("lobby");
  });
});

httpServer.listen(3001, () => {
  console.log("listening on *:3001");
});
