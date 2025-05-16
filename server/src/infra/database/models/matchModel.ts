import { Model } from "objection";
import { RoomModel } from "./roomModel.js";
import { UserModel } from "./userModel.js";
import { RoundModel } from "./roundModel.js";

class MatchModel extends Model {
  static tableName = "matches";

  id!: string;
  state!: string;

  roomId!: string;
  room!: RoomModel;

  winnerId?: string;
  winner?: UserModel;

  rounds?: RoundModel[];

  createdAt!: Date;
  updatedAt?: Date;

  static get relationMappings() {
    return {
      room: {
        relation: Model.BelongsToOneRelation,
        modelClass: RoomModel,
        join: {
          from: "matches.roomId",
          to: "rooms.id",
        },
      },
      winner: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "matches.winnerId",
          to: "users.id",
        },
      },
      rounds: {
        relation: Model.HasManyRelation,
        modelClass: RoundModel,
        join: {
          from: "matches.id",
          to: "rounds.matchId",
        },
      },
    };
  }
}

export { MatchModel };
