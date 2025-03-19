export const useRound = () => {
  const createMockDeck = () => {
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
    const deck = [];

    suits.forEach((suit) => {
      values.forEach((value) => {
        deck.push({
          id: `${suit}-${value}`,
          suit,
          value,
          isFaceDown: true,
        });
      });
    });

    return deck;
  };

  const round = {
    id: "mock-round-id",
    deck: createMockDeck(),
    discardPile: [],
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
        hand: createMockDeck().slice(0, 9).map(card => ({...card, isFaceDown: false})),
      },
      {
        player: {
          id: "player-2",
          name: "Player 2",
          email: "player2@example.com",
        },
        hand: createMockDeck().slice(9, 18),
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
