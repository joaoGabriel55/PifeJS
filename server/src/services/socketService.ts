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

      const lastRound = match.rounds[match.rounds.length - 1];

      console.log('lastRound', JSON.stringify(lastRound.hands));


      this.players.forEach((playerSocket, index) => {
        playerSocket.emit("gameStart", {
          deckSize: lastRound.deck.length,
          discardPile: lastRound.discardPile,
          currentPlayer: lastRound.currentPlayer.id,
          hand: lastRound.hands[index].hand,
          connectedPlayerId: lastRound.hands[index].player.id,
          matchId: match.id,
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
          currentPlayer: turn.currentPlayer.id,
          hand: turn.hands[index].hand,
        });
      });
    });

    // "empresta" uma carta do descarte
    socket.on("drawDiscard", (data) => {
      const { cardId } = data;

      const { hands, deck, discardPile, currentPlayer } =
        currentMatch.rounds[0];

      const playerHand = hands.find((hand) => hand.id === currentPlayerIndex.toString());

      if (!playerHand) {
        return;
      }

      const playerIndex = playerHand.hand.findIndex((c) => c.id === cardId);

      const [drawnCard] = discardPile.splice(discardPile.length - 1, 1); // get discard pile's top card
      const [discardedCard] = playerHand.hand.splice(playerIndex, 1, drawnCard);

      (discardPile as Card[]).push(discardedCard);

      currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
      console.log("drawDiscard", currentPlayerIndex);
      this.players.forEach((playerSocket, index) => {
        playerSocket.emit("updateBoard", {
          discardPile,
          deckSize: deck.length,
          currentPlayer: this.players[currentPlayerIndex].id,
          hand: currentMatch.rounds[0].hands[index].hand,
        });
      });
    });

    socket.on("deckDiscard", (data) => {
      const { cardId } = data;

      const { deck, discardPile, currentPlayer } =
        currentMatch.rounds[0];

      const [drawnCard] = deck.splice(deck.length - 1, 1); // get deck's top card

      (discardPile as Card[]).push(drawnCard);

      currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
      console.log("drawDiscard", currentPlayerIndex);
      this.players.forEach((playerSocket, index) => {
        playerSocket.emit("updateBoard", {
          discardPile,
          deckSize: deck.length,
          currentPlayer: this.players[currentPlayerIndex].id,
          hand: currentMatch.rounds[0].hands[index].hand,
        });
      });
    });

    socket.on("disconnect", () => {
      this.players = this.players.filter((s) => s.id !== socket.id);
      console.log("user disconnected", socket.id);
    });
  }
}
