import { Round } from "../../domain/round.js";
import { BaseRepository } from "../baseRepository.js";

export class MockRoundsRepository extends BaseRepository<Round> {
  private rounds: Array<Round>;

  constructor(rounds: Array<Round> = []) {
    super();
    this.rounds = rounds;
  }

  async create(roundData: Round): Promise<Round> {
    const newRound = {
      ...roundData,
    };

    this.rounds.push(newRound);
    return newRound;
  }
}
