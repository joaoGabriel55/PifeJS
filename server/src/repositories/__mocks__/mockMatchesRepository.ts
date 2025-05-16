import { Match } from "../../domain/match.js";
import { BaseRepository } from "../baseRepository.js";
import { MOCK_ROOMS } from "./mockRoomsRepository.js";
import { MOCK_USERS } from "./mockUsersRepository.js";

export const MOCK_MATCHES = [
  {
    id: "5574901f-61a1-4de2-9d8d-397ef00e8834",
    room: {
      ...MOCK_ROOMS[0],
      players: [MOCK_USERS[0], MOCK_USERS[1]],
    },
    state: "ONGOING",
    createdAt: new Date(),
  },
];

export class MockMatchesRepository extends BaseRepository<Match> {
  private matches: Array<any>;

  constructor(matches: Array<any> = MOCK_MATCHES) {
    super();
    this.matches = matches;
  }

  async index(): Promise<Array<Match>> {
    return this.matches;
  }

  async find(id: string): Promise<Match | null> {
    return this.matches.find((match) => match.id === id) || null;
  }

  async create(matchData: Match): Promise<Match> {
    const newMatch = {
      ...matchData,
    };

    this.matches.push(newMatch);
    return newMatch;
  }
}
