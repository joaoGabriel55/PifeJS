import { TCard } from "../components/card/CardDisplay";

export type TPlayer = {
  id: string;
  name: string;
  email: string;
};

export type THand = {
  player: TPlayer;
  hand: TCard[];
};

export type TRound = {
  id: string;
  discardPile: TCard[];
  deck: TCard[];
  currentPlayer: TPlayer;
  hands: THand[];
  match: {
    id: string;
    state: "ONGOING" | "FINISHED";
    room: {
      id: string;
      owner: TPlayer;
      players: TPlayer[];
      createdAt: Date;
    };
    rounds: TRound[];
    createdAt: Date;
  };
  createdAt: Date;
};

export const useRound = () => {
  const createMockDeck = (): TCard[] => {
    const suits = ["HEARTS", "DIAMONDS", "CLUBS", "SPADES"] as const;
    const values = [
      "A",
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
    ] as const;
    const deck: TCard[] = [];

    suits.forEach((suit) => {
      values.forEach((value) => {
        deck.push({
          id: `${suit}-${value}`,
          suit,
          value,
          isFaceDown: true,
          source: "DECK",
        });
      });
    });

    return deck;
  };

  const shuffleDeck = (deck: TCard[]): TCard[] => {
    const shuffledDeck = [...deck];
    for (let i = shuffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }
    return shuffledDeck;
  };

  const deck = shuffleDeck(createMockDeck());

  const round: TRound = {
    id: "mock-round-id",
    discardPile: [],
    deck: deck.map((card) => ({ ...card, source: "DECK" })),
    currentPlayer: {
      id: "player-1",
      name: "Player 1",
      email: "player1@example.com",
    },
    hands: [
      {
        player: {
          id: "player-1",
          name: "Player 1",
          email: "player1@example.com",
        },
        hand: deck
          .slice(0, 9)
          .map((card) => ({ ...card, isFaceDown: false, source: "PLAYER" })),
      },
      {
        player: {
          id: "player-2",
          name: "Player 2",
          email: "player2@example.com",
        },
        hand: deck.slice(0, 9).map((card) => ({ ...card, source: "OPPONENT" })),
      },
    ],
    match: {
      id: "mock-match-id",
      state: "ONGOING",
      room: {
        id: "mock-room-id",
        owner: {
          id: "player-1",
          name: "Player 1",
          email: "player1@example.com",
        },
        players: [
          {
            id: "player-1",
            name: "Player 1",
            email: "player1@example.com",
          },
          {
            id: "player-2",
            name: "Player 2",
            email: "player2@example.com",
          },
        ],
        createdAt: new Date(),
      },
      rounds: [],
      createdAt: new Date(),
    },
    createdAt: new Date(),
  };

  return {
    round,
    isLoading: false,
    isError: false,
  };
};
