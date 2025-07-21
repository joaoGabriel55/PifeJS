import { Server, Socket } from "socket.io";
import { Deck } from "../domain/deck.js";
import { Card, Suits, Values } from "../domain/card.js";
import { Repositories } from "../http/server.js";
import { MatchService } from "./matchService.js";

export class SocketService {
  private players: Socket[] = [];
  private repositories: Repositories;
  private matchesService: MatchService;

  constructor(private io: Server, repositories: Repositories) {
    this.repositories = repositories;
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
    this.players.push(socket);

    const matchId = socket.handshake.query.matchId as string;

    if (this.players.length === 2) {
      const match = await this.matchesService.getById(matchId);

      const lastRound = match.rounds[0];


      this.players.forEach((playerSocket, index) => {
        playerSocket.emit("gameStart", {
          deckSize: lastRound.deck.length,
          discardPile: lastRound.discardPile,
          currentPlayer: lastRound.currentPlayer,
          hand: lastRound.hands[index].hand,
          connectedPlayer: lastRound.hands[index].player,
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

      const newHands = hands.map(({player, hand}) => {
        if (player.id === currentPlayer.id) {
          return {
            player,
            hand: playerHand.hand,
          };
        }
        return {player, hand};
      });

      const turn = await this.matchesService.playTurn(matchId, {
        match: matchId,
        hands: newHands,
        deck: deck,
        discardPile: discardPile,
        playerAction: "DRAW",
        createdAt: new Date(),
      });

      this.players.forEach((playerSocket, index) => {
        playerSocket.emit("updateBoard", {
          discardPile: turn.discardPile,
          deckSize: turn.deck.length,
          currentPlayer: turn.currentPlayer,
          hand: turn.hands[index].hand,
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

      this.players.forEach((playerSocket, index) => {
        playerSocket.emit("updateBoard", {
          discardPile: turn.discardPile,
          deckSize: turn.deck.length,
          currentPlayer: turn.currentPlayer,
          hand: turn.hands[index].hand,
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

      this.players.forEach((playerSocket, index) => {
        playerSocket.emit("updateBoard", {
          discardPile: turn.discardPile,
          deckSize: turn.deck.length,
          currentPlayer: turn.currentPlayer,
          hand: turn.hands[index].hand,
          gameFinished: turn.match.state === "FINISHED",
          winner: turn.match.winner || null,
        });
      });
    });

    socket.on("disconnect", () => {
      this.players = this.players.filter((s) => s.id !== socket.id);
      console.log("user disconnected", socket.id);
    });
  }
}
