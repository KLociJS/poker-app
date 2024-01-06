const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000" },
});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("message", (msg) => {
    console.log("message: " + msg);

    io.emit("message", "Hello from server");
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(3001, () => {
  console.log("listening on *:3001");
});
