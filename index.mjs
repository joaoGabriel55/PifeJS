import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import reducer, { ACTIONS, initialState } from "./js/state/reducer.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static("assets"));
app.use(express.static("css"));
app.use(express.static("js"));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

let players = [];
let state = initialState;

io.on("connection", (socket) => {
  console.log("a user connected");
  const playerId = `player_${socket.client.id}`;
  players.push(playerId);

  io.emit("player_in", playerId);

  if (players.length === 2) {
    state = reducer({ state, action: { type: ACTIONS.SHUFFLE_DECK } });
    state = reducer({ state, action: { type: ACTIONS.DISTRIBUTE_CARDS, payload: players } });
    io.emit("state_changed", { state, action: null });
    io.emit("start_game");

    socket.on("state_change", (payload) => {
      const action = { ...payload }
      state = reducer({ state, action });
      io.emit("state_changed", { state, action });
    });
  }

  socket.on("disconnect", (a) => {
    console.log("user disconnected");
    players = players.filter((player) => player !== playerId);

    io.emit("player_out", playerId);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
