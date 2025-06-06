import { Server, Socket } from "socket.io";
import { Deck } from "../domain/deck.js";
import { Card, Suits, Values } from "../domain/card.js";

function createShuffleDeck() {
  const suits: Suits[] = ["SPADES", "HEARTS", "DIAMONDS", "CLUBS"];
  const values: Values[] = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
    "A",
  ];
  let deck = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value, id: `${value}-${suit}` });
    }
  }

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function dealIntialCards(deck: Deck, playerCount: number) {
  const playerHands: Card[][] = Array.from({ length: playerCount }, () => []);

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < playerCount; j++) {
      playerHands[j].push(deck.shift()!);
    }
  }

  return { playerHands, remainingDeck: deck };
}

const deck: Deck = createShuffleDeck();
const { playerHands, remainingDeck } = dealIntialCards(deck, 2);

const currentMatch = {
  state: "ONGOING",
  rounds: [
    {
      deck: remainingDeck,
      discardPile: [],
      hands: [
        {
          id: "0",
          hand: playerHands[0],
        },
        {
          id: "1",
          hand: playerHands[1],
        },
      ],
      currentPlayer: "1",
    },
  ],
};
let currentPlayerIndex = 0;
export class SocketService {
  private players: Socket[] = [];

  constructor(private io: Server) {}

  initialize() {
    this.io.on("connection", this.handleConnection.bind(this));
  }

  private handleConnection(socket: Socket) {
    this.players.push(socket);

    if (this.players.length === 2) {
      this.players.forEach((playerSocket, index) => {
        playerSocket.emit("gameStart", {
          deckSize: currentMatch.rounds[0].deck.length,
          discardPile: [],
          currentPlayer: this.players[0].id,
          hand: currentMatch.rounds[0].hands[index].hand,
          connectedPlayerId: playerSocket.id,
        });
      });
    }

    // "empresta" uma carta
    socket.on("drawCard", (data) => {
      const { cardId } = data;

      const { hands, deck, discardPile, currentPlayer } =
      currentMatch.rounds[0];

      const playerHand = hands.find((hand) => hand.id === currentPlayerIndex.toString());

      if (!playerHand) {
        return;
      }

      const playerIndex = playerHand.hand.findIndex((c) => c.id === cardId);

      const [drawnCard] = deck.splice(deck.length - 1, 1); // get deck's top card
      const [discardedCard] = playerHand.hand.splice(playerIndex, 1, drawnCard);

      (discardPile as Card[]).push(discardedCard);

      currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
      console.log("drawCard", currentPlayerIndex);
      this.players.forEach((playerSocket, index) => {
        playerSocket.emit("updateBoard", {
          discardPile,
          deckSize: deck.length,
          currentPlayer: this.players[currentPlayerIndex].id,
          hand: currentMatch.rounds[0].hands[index].hand,
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
