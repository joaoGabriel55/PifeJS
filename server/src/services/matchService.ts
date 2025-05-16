import { Card, Suits, Values } from "../domain/card.js";
import { Deck } from "../domain/deck.js";
import { Match, PLAYER_HAND_SIZE } from "../domain/match.js";
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

    await this.initRound(match.id);

    return match;
  }

  async initRound(matchId: string) {
    const match = await this.matchesRepository.find(matchId);

    if (!match) {
      throw new NotFoundError("Match not found");
    }

    const room = match.room;

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
    const match = await this.matchesRepository.find(matchId);

    if (!match) {
      throw new NotFoundError("Match not found");
    }

    if (match.state !== "ONGOING") {
      throw new ValidationError(["Match is not ongoing"]);
    }

    const lastRound = match.rounds[match.rounds.length - 1];
    const lastPlayer = lastRound.currentPlayer;
    let currentPlayer = lastPlayer;

    if (match.rounds.length > 1) {
      const lastPlayerIndex = match.room.players.findIndex(
        (player) => player.id === currentPlayer.id
      );
      const players = match.room.players.sort(this.sortByEmail);
      const nextPlayerIndex = (lastPlayerIndex + 1) % players.length;

      currentPlayer = players[nextPlayerIndex];
    }

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

    if (this.checkForWinner()) {
      match.state = "FINISHED";
      match.winner = currentPlayer;

      const updatedMatch = await this.matchesRepository.update(match.id, match);

      if (!updatedMatch) {
        throw new Error("Failed to update match");
      }

      newRound.match = updatedMatch;
    }

    const round = await this.roundsRepository.create(newRound);

    return round;
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
        deck.push({ suit, value });
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

  private checkForWinner(): boolean {
    return false;
  }
}
