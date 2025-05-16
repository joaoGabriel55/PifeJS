import { Match } from "../domain/match.js";
import { MatchModel } from "../infra/database/models/matchModel.js";
import { BaseRepository } from "./baseRepository.js";

export class MatchesRepository extends BaseRepository<Match> {
  async create(matchData: Match): Promise<Match> {
    const { room, winner, rounds, ...match } = matchData;

    return await MatchModel.transaction(async (trx) => {
      try {
        const insertedMatch = await MatchModel.query(trx).insertAndFetch(match);

        if (room) {
          await insertedMatch.$relatedQuery("room", trx).relate(room.id);
        }

        if (winner) {
          await insertedMatch.$relatedQuery("winner", trx).relate(winner.id);
        }

        return await MatchModel.query(trx)
          .findById(insertedMatch.id)
          .withGraphJoined("[rooms, rounds, winner]");
      } catch (error) {
        throw new Error("Failed to create match");
      }
    });
  }
}
