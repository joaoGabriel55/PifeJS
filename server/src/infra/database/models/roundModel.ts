import { Model, QueryContext } from "objection";
import { MatchModel } from "./matchModel.js";
import { UserModel } from "./userModel.js";
import { Hands, PlayerActions } from "../../../domain/round.js";
import { Deck } from "../../../domain/deck.js";

class RoundModel extends Model {
  static tableName = "rounds";

  id!: string;
  deck!: Deck;
  hands!: Hands;
  discardPile?: Deck;

  matchId!: string;
  match!: MatchModel;

  playerAction?: PlayerActions;

  currentPlayerId!: string;
  currentPlayer!: UserModel;

  createdAt!: Date;
  updatedAt?: Date;

  static get relationMappings() {
    return {
      match: {
        relation: Model.BelongsToOneRelation,
        modelClass: MatchModel,
        join: {
          from: "rounds.matchId",
          to: "matches.id",
        },
      },
      currentPlayer: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "rounds.currentPlayerId",
          to: "users.id",
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        deck: {
          type: 'array',
          items: { type: 'object' },
        },
        discardPile: {
          type: 'array',
          items: { type: 'object' },
        },
        hands: {
          type: 'array',
          items: { type: 'object' },
        },
      }
    }
  }
}

export { RoundModel };
