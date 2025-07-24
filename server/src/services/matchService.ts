import { Card, Suits, Values } from "../domain/card.js";
import { Deck } from "../domain/deck.js";
import { Match, PLAYER_HAND_SIZE } from "../domain/match.js";
import { Room } from "../domain/room.js";
import { CreateRoundDto, Round } from "../domain/round.js";
import { User } from "../domain/user.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { ValidationError } from "../errors/validationError.js";
import { MatchesRepository } from "../repositories/matchesRepository.js";
import { RoomsRepository } from "../repositories/roomsRepository.js";
import { RoundsRepository } from "../repositories/roundsRepository.js";
import { generateId } from "../shared/entityId.js";

export class MatchService {
  private roomsRepository: RoomsRepository;
  private matchesRepository: MatchesRepository;
  private roundsRepository: RoundsRepository;

  constructor(
    roomsRepository: RoomsRepository,
    matchesRepository: MatchesRepository,
    roundsRepository: RoundsRepository
  ) {
    this.roomsRepository = roomsRepository;
    this.matchesRepository = matchesRepository;
    this.roundsRepository = roundsRepository;
  }

  async getAllByRoom(roomId: string) {
    return await this.matchesRepository.fetchAllByRoom(roomId);
  }

  async start(roomId: string) {
    const room = await this.roomsRepository.find(roomId);

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    if (room.players.length < 2) {
      throw new ValidationError(["Room must have at least 2 players"]);
    }

    const newMatch: Match = {
      id: generateId(),
      room,
      createdAt: new Date(),
      state: "ONGOING",
      rounds: [],
    };

    const match = await this.matchesRepository.create(newMatch);

    if (!match) {
      throw new Error("Failed to create match");
    }

    await this.initRound(match, room);

    return match;
  }

  async initRound(match: Match, room: Room) {
    const deck = this.createShuffleDeck();

    const { playerHands, remainingDeck } = this.dealIntialCards(
      deck,
      room.players.length
    );

    const currentPlayer = room.players.sort(this.sortByEmail)[0];

    const round: Round = {
      id: generateId(),
      deck: remainingDeck,
      hands: room.players.map((player, index) => ({
        player,
        hand: playerHands[index],
      })),
      match,
      discardPile: [],
      currentPlayer,
      createdAt: new Date(),
    };

    return await this.roundsRepository.create(round);
  }

  async playTurn(matchId: string, roundData: CreateRoundDto) {
    const match = await this.matchesRepository.findById(matchId);

    if (!match) {
      throw new NotFoundError("Match not found");
    }

    if (match.state !== "ONGOING") {
      throw new ValidationError(["Match is not ongoing"]);
    }

    const lastRound = match.rounds[0];
    const lastPlayer = lastRound.currentPlayer;

    const currentPlayer = match.room.players.find((player) => player.id !== lastPlayer.id) as User;

    const playerHands = roundData.hands.reduce((acc, hand) => {
      acc[hand.player.id] = hand.hand;
      return acc;
    }, {} as Record<string, Card[]>);

    const newRound: Round = {
      id: generateId(),
      match,
      currentPlayer,
      createdAt: new Date(),
      hands: match.room.players.map((player) => ({
        player,
        hand: playerHands[player.id],
      })),
      deck: roundData.deck,
      discardPile: roundData.discardPile,
      playerAction: roundData.playerAction,
    };

    if (this.checkForWinner(playerHands[currentPlayer.id])) {
      match.state = "FINISHED";
      match.winner = currentPlayer;

      const updatedMatch = await this.matchesRepository.update(match.id, match);

      if (!updatedMatch) {
        throw new Error("Failed to update match");
      }

      newRound.match = updatedMatch;
    }

    const round = await this.roundsRepository.create(newRound);

    if (!round) {
      throw new Error("Failed to create round");
    }

    return round;
  }

  async getById(id: string) {
    const match = await this.matchesRepository.findById(id);

    if (!match) {
      throw new NotFoundError("Match not found");
    }

    return match;
  }

  getTopCard(match: Match) {
    const latestRound = match.rounds.reduce((latest, current) => {
      return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest
    });

    const deck = latestRound.deck;

    return deck[deck.length - 1];
  }

  private createShuffleDeck(): Deck {
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
    let deck: Deck = [];

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

  private dealIntialCards(deck: Deck, playerCount: number) {
    const playerHands: Card[][] = Array.from({ length: playerCount }, () => []);

    for (let i = 0; i < PLAYER_HAND_SIZE; i++) {
      for (let j = 0; j < playerCount; j++) {
        playerHands[j].push(deck.shift()!);
      }
    }

    return { playerHands, remainingDeck: deck };
  }

  private sortByEmail(a: User, b: User) {
    return a.email.localeCompare(b.email);
  }

  private checkForWinner(cards: Card[]): boolean {
    const cardsMap = {
      'A': 1,
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 10,
      'J': 11,
      'Q': 12,
      'K': 13,
    };

    const validGame: Card[] = [
      { suit: "SPADES", value: "A", id: "A-SPADES" },
      { suit: "HEARTS", value: "A", id: "A-HEARTS" },
      { suit: "DIAMONDS", value: "A", id: "A-DIAMONDS" },
      { suit: "CLUBS", value: "2", id: "2-CLUBS" },
      { suit: "CLUBS", value: "3", id: "3-CLUBS" },
      { suit: "CLUBS", value: "4", id: "4-CLUBS" },
      { suit: "CLUBS", value: "Q", id: "Q-CLUBS" },
      { suit: "CLUBS", value: "K", id: "K-CLUBS" },
      { suit: "CLUBS", value: "A", id: "A-CLUBS" },
    ];

    const newCards = validGame.map((card) => {
      return {
        ...card,
        value: cardsMap[card.value],
      };
    });

    function isSequence(cards: typeof newCards) {
      const values = cards.map((card) => card.value).sort((a, b) => a - b);

      return (
        (values[0] + 1 === values[1] && values[1] + 1 === values[2]) ||
        (values.includes(12) && values.includes(13) && values.includes(1)) // Q, K, A
      );
    }

    function isSameValue(cards: typeof newCards) {
      return (
        cards[0].value === cards[1].value &&
        cards[1].value === cards[2].value &&
        new Set(cards.map((card) => card.suit)).size === 3
      );
    }

    function findSets(cards: typeof newCards, setsFound: number) {
      if (setsFound === 3) return true;
      if (cards.length < 3) return false;

      for (let i = 0; i < cards.length - 2; i++) {
        for (let j = i + 1; j < cards.length - 1; j++) {
          for (let k = j + 1; k < cards.length; k++) {
            const selectedCards = [cards[i], cards[j], cards[k]];
            if (isSameValue(selectedCards) || isSequence(selectedCards)) {
              const remainingCards = cards.filter(
                (_, index) => index !== i && index !== j && index !== k
              );
              if (findSets(remainingCards, setsFound + 1)) return true;
            }
          }
        }
      }
      return false;
    }

    return findSets(newCards, 0);
  }
}
