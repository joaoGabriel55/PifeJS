import { Deck } from "../domain/deck.js";
import { Match } from "../domain/match.js";
import { Round } from "../domain/round.js";
import { RoundModel } from "../infra/database/models/roundModel.js";
import { BaseRepository } from "./baseRepository.js";

export class RoundsRepository extends BaseRepository<Round> {
    async create(roundData: Round): Promise<Round | null> {
        const { match, ...round } = roundData;

        const newRound = await RoundModel.query()
            .insertAndFetch({
            id: round.id,
            deck: round.deck,
            hands: round.hands,
            matchId: match.id,
            discardPile: round.discardPile,
            createdAt: round.createdAt,
            currentPlayerId: round.currentPlayer.id,
            playerAction: round.playerAction,
            })
            .withGraphFetched('currentPlayer');

        return newRound ? this.parse(newRound) : null;
    }

    private parse(model: RoundModel): Round {
        return {
            ...model,
            deck: model.deck as Deck,
            discardPile: model.discardPile as Deck,
            match: model.match as Match,
        }
    }
}
