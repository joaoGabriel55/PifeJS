import { Server, Socket } from "socket.io";
import { config } from "./config.js";
import { makeServer } from "./http/server.js";
import { makeDatabase } from "./infra/database/database.js";
import http from "http";
import { SocketService } from "./services/socketService.js";

const database = makeDatabase();

database
  .connect()
  .then(() => {
    const server = http.createServer(makeServer());
    const io = new Server(server);
    
    const socketService = new SocketService(io);
    socketService.initialize();

    server.listen(config.http.port, () => {
      console.log(`Server is running on port ${config.http.port}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
