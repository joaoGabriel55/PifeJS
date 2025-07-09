import { Server, Socket } from "socket.io";
import { config } from "./config.js";
import { makeServer, repositories } from "./http/server.js";
import { makeDatabase } from "./infra/database/database.js";
import http from "http";
import { SocketService } from "./services/socketService.js";

const database = makeDatabase();

database
  .connect()
  .then(() => {
    const server = http.createServer(makeServer());
    const io = new Server(server, {cors: { origin: '*' }});
    
    const socketService = new SocketService(io, repositories);
    socketService.initialize();

    server.listen(config.http.port, () => {
      console.log(`Server is running on port ${config.http.port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
