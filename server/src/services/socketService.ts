import { Server, Socket } from "socket.io";

export class SocketService {
  private players: Socket[] = [];

  constructor(private io: Server) {}

  initialize() {
    this.io.on("connection", this.handleConnection.bind(this));
  }

  private handleConnection(socket: Socket) {
    this.players.push(socket);

    if (this.players.length === 2) {
      const messages = ["player1", "player2"];

      this.players.forEach((playerSocket, index) => {
        playerSocket.emit("gameStart", {
          userName: messages[index],
          currentPlayer: "player1",
        });
      });
    }

    // "empresta" uma carta
    socket.on("drawCard", (data) => {

      /**
       * {
       *    player, // cara que fez a jogada
       *    updatedDiscardPile, // pilha de descarte atualizada
       *    card,
       * }
       */
      console.log("dado", data)

      // validou/atualizou
      // emit para os jogadores
    });

    // descarta carta
    socket.on("discardCard", () => {});

    socket.on("disconnect", () => {
      this.players = this.players.filter((s) => s.id !== socket.id);
      console.log("user disconnected", socket.id);
    });
  }
}
