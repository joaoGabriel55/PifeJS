import { Deck } from "../domain/deck.js";
import { Match, MatchState } from "../domain/match.js";
import { MatchModel } from "../infra/database/models/matchModel.js";
import { BaseRepository } from "./baseRepository.js";

export class MatchesRepository extends BaseRepository<Match> {
  async create(matchData: Match): Promise<Match | null> {
    const { room, winner, rounds, ...match } = matchData;

    return await MatchModel.transaction(async (trx) => {
      try {
        const insertedMatch = await MatchModel.query(trx).insertAndFetch({
          ...match,
          roomId: room.id,
          winnerId: winner?.id,
        });

        const newMatch = await MatchModel.query(trx)
          .findById(insertedMatch.id)
          .withGraphJoined("[room, rounds, winner]");

        return newMatch ? this.parse(newMatch) : null;
      } catch (error) {
        throw new Error("Failed to create match");
      }
    });
  }

  async findById(id: string): Promise<Match | null> {
    const match = await MatchModel.query().findById(id).withGraphJoined("[room, rounds, winner]");

    return match ? this.parse(match) : null;
  }

  private parse(model: MatchModel): Match {
    return {
      ...model,
      room: {
        ...model.room,
        players: model.room.players?.map(player => ({ id: player.id, email: player.email, name: player.name })) || [],
      },
      state: model.state as MatchState,
      rounds: model.rounds?.map(round => ({
        ...round,
        deck: round.deck as Deck,
        discardPile: round.discardPile as Deck,
        match: round.match as Match,
      })) || [],
    }
  }
}
