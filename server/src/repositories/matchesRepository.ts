import { Deck } from "../domain/deck.js";
import { Match, MatchState } from "../domain/match.js";
import { MatchModel } from "../infra/database/models/matchModel.js";
import { BaseRepository } from "./baseRepository.js";

export class MatchesRepository extends BaseRepository<Match> {
  async fetchAllByRoom(roomId: string): Promise<Array<Match>> {
    const matches = await MatchModel.query().where("roomId", roomId).where("state", "ONGOING");

    return matches.map(this.parse);
  }

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

  async update(id: string, data: Partial<Match>): Promise<Match | null> {
    const { room, winner, rounds, ...matchData } = data;

    try {
        const updatedMatch = await MatchModel.query()
          .findById(id)
          .patchAndFetch({
            ...matchData,
            roomId: room?.id,
            winnerId: winner?.id,
          }).withGraphJoined("[room, rounds, winner]");

        return updatedMatch ? this.parse(updatedMatch) : null;
    } catch (error) {
      throw new Error("Failed to create match");
    }
  }

  async findById(id: string): Promise<Match | null> {
    // Order rounds in descending order by their 'id' (or another field, e.g., 'createdAt' if preferred)
    const match = await MatchModel.query()
      .findById(id)
      .withGraphJoined("[room.[players], rounds.[currentPlayer], winner]")
      .modifyGraph("rounds", builder => {
        builder.orderBy("createdAt", "desc");
      });

    return match ? this.parse(match) : null;
  }

  async update(id: string, matchData: Partial<Omit<Match, 'room' | 'rounds'>>): Promise<Match | null> {
    const { winner, ...matchDetails } = matchData;

    const updatedMatch = await MatchModel.query()
      .findById(id)
      .patchAndFetchById(id, { ...matchDetails, winnerId: winner?.id })
      .withGraphFetched("[room, rounds, winner]");

    return updatedMatch ? this.parse(updatedMatch) : null;
  }

  private parse(model: MatchModel): Match {
    return {
      ...model,
      room: {
        ...model.room,
        players: model.room?.players?.map(player => ({ id: player.id, email: player.email, name: player.name })) || [],
      },
      state: model.state as MatchState,
      rounds: model.rounds?.map(round => ({
        ...round,
        deck: round.deck as Deck,
        discardPile: round.discardPile as Deck,
        match: round.match as Match,
      })) || [],
      winner: model.winner ? {
        id: model.winner.id,
        email: model.winner.email,
        name: model.winner.name,
      } : undefined,
    }
  }
}
