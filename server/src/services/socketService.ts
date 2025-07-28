import { Server, Socket } from "socket.io";
import { Card } from "../domain/card.js";
import { Repositories } from "../http/server.js";
import { MatchService } from "./matchService.js";
import { verifyToken } from "../shared/jwtToken.js";

export class SocketService {
  private players: Record<string, Socket>;
  private repositories: Repositories;
  private matchesService: MatchService;

  constructor(private io: Server, repositories: Repositories) {
    this.repositories = repositories;
    this.players = {};
    this.matchesService = new MatchService(
      new this.repositories.roomsRepository(),
      new this.repositories.matchesRepository(),
      new this.repositories.roundsRepository()
    );
  }

  initialize() {
    this.io.on("connection", this.handleConnection.bind(this));
  }

  private async handleConnection(socket: Socket) {
    const { userId } = verifyToken(socket.handshake.auth.token);

    this.players[userId] = socket;

    const matchId = socket.handshake.query.matchId as string;

    if (Object.keys(this.players).length === 2) {
      const match = await this.matchesService.getById(matchId);

      if (match.state === "FINISHED") {
        Object.values(this.players).forEach((playerSocket: Socket) => {
          playerSocket.emit("gameOver", {
            winner: match.winner,
          });
        });
        return;
      }

      const lastRound = match.rounds[0];

      Object.entries(this.players).forEach(([userId, playerSocket]) => {
        playerSocket.emit("gameStart", {
          deckSize: lastRound.deck.length,
          discardPile: lastRound.discardPile,
          currentPlayer: lastRound.currentPlayer,
          hand: lastRound.hands.find(hand => hand.player.id === userId)?.hand,
          connectedPlayer: lastRound.hands.find(hand => hand.player.id !== userId)?.player,
          matchId: match.id,
          gameFinished: false,
          winner: null,
        });
      });
    }

    // "empresta" uma carta
    socket.on("drawCard", async (data) => {
      const { cardId } = data;

      const match = await this.matchesService.getById(matchId);

      const lastRound = match.rounds[0];

      const { hands, deck, discardPile, currentPlayer } =
        lastRound;

      const playerHand = hands.find((hand) => hand.player.id === currentPlayer.id);

      if (!playerHand) {
        return;
      }

      const playerIndex = playerHand.hand.findIndex((c) => c.id === cardId);

      const [drawnCard] = deck.splice(deck.length - 1, 1); // get deck's top card
      const [discardedCard] = playerHand.hand.splice(playerIndex, 1, drawnCard);

      (discardPile as Card[]).push(discardedCard);

      const newHands = hands.map(({ player, hand }) => {
        if (player.id === currentPlayer.id) {
          return {
            player,
            hand: playerHand.hand,
          };
        }
        return { player, hand };
      });

      const turn = await this.matchesService.playTurn(matchId, {
        match: matchId,
        hands: newHands,
        deck: deck,
        discardPile: discardPile,
        playerAction: "DRAW",
        createdAt: new Date(),
      });

      if (turn.match.state === "FINISHED") {
        Object.values(this.players).forEach((playerSocket) => {
          playerSocket.emit("gameOver", {
            winner: turn.match.winner,
          });
        });
        return;
      }

      Object.entries(this.players).forEach(([userId, playerSocket]) => {
        playerSocket.emit("updateBoard", {
          discardPile: turn.discardPile,
          deckSize: turn.deck.length,
          currentPlayer: turn.nextPlayer,
          hand: turn.hands.find(hand => hand.player.id === userId)?.hand,
          gameFinished: turn.match.state === "FINISHED",
          winner: turn.match.winner || null,
        });
      });
    });

    // "empresta" uma carta do descarte
    socket.on("drawDiscard", async (data) => {
      const { cardId } = data;

      const match = await this.matchesService.getById(matchId);

      const lastRound = match.rounds[0];

      const { hands, deck, discardPile = [], currentPlayer } = lastRound;

      const playerHand = hands.find((hand) => hand.player.id === currentPlayer.id);

      if (!playerHand) {
        return;
      }

      const playerIndex = playerHand.hand.findIndex((c) => c.id === cardId);

      const [drawnCard] = discardPile.splice(discardPile.length - 1, 1); // get discard pile's top card
      const [discardedCard] = playerHand.hand.splice(playerIndex, 1, drawnCard);

      (discardPile as Card[]).push(discardedCard);

      const turn = await this.matchesService.playTurn(matchId, {
        match: matchId,
        hands: hands,
        deck: deck,
        discardPile: discardPile,
        playerAction: "DRAW",
        createdAt: new Date(),
      });

      if (turn.match.state === "FINISHED") {
        Object.values(this.players).forEach((playerSocket) => {
          playerSocket.emit("gameOver", {
            winner: turn.match.winner,
          });
        });
        return;
      }

      Object.entries(this.players).forEach(([userId, playerSocket]) => {
        playerSocket.emit("updateBoard", {
          discardPile: turn.discardPile,
          deckSize: turn.deck.length,
          currentPlayer: turn.nextPlayer,
          hand: turn.hands.find(hand => hand.player.id === userId)?.hand,
          gameFinished: turn.match.state === "FINISHED",
          winner: turn.match.winner || null,
        });
      });
    });

    socket.on("deckDiscard", async (_) => {
      const match = await this.matchesService.getById(matchId);

      const { deck, discardPile } = match.rounds[0];

      const [drawnCard] = deck.splice(deck.length - 1, 1); // get deck's top card

      (discardPile as Card[]).push(drawnCard);

      const turn = await this.matchesService.playTurn(matchId, {
        match: matchId,
        hands: match.rounds[0].hands,
        deck: deck,
        discardPile: discardPile,
        playerAction: "DISCARD",
        createdAt: new Date(),
      });

      Object.entries(this.players).forEach(([userId, playerSocket]) => {
        playerSocket.emit("updateBoard", {
          discardPile: turn.discardPile,
          deckSize: turn.deck.length,
          currentPlayer: turn.nextPlayer,
          hand: turn.hands.find(hand => hand.player.id === userId)?.hand,
          gameFinished: turn.match.state === "FINISHED",
          winner: turn.match.winner || null,
        });
      });
    });

    socket.on("disconnect", () => {
      delete this.players[userId];
      console.log("user disconnected", userId);
    });
  }
}
