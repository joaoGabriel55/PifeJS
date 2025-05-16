import { Model } from "objection";
import { MatchModel } from "./matchModel.js";
import { UserModel } from "./userModel.js";

class RoundModel extends Model {
  static tableName = "rounds";

  id!: string;
  deck!: object;
  hands!: object;

  matchId!: string;
  match!: MatchModel;

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
}

export { RoundModel };
