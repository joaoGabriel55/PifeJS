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

  playerId!: string;
  player!: UserModel;

  nextPlayerId?: string;
  nextPlayer?: UserModel;

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
      player: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "rounds.playerId",
          to: "users.id",
        },
      },
      nextPlayer: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "rounds.nextPlayerId",
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
