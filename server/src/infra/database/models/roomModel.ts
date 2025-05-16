import { Model } from "objection";
import { UserModel } from "./userModel.js";

class RoomModel extends Model {
  static tableName = "rooms";

  id!: string;
  name?: string;
  createdAt!: Date;
  updatedAt?: Date;

  owner!: UserModel;
  ownerId!: string;

  players?: UserModel[];

  static get relationMappings() {
    return {
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "rooms.ownerId",
          to: "users.id",
        },
      },
      players: {
        relation: Model.ManyToManyRelation,
        modelClass: UserModel,
        join: {
          from: "rooms.id",
          through: {
            from: "room_players.roomId",
            to: "room_players.playerId",
          },
          to: "users.id",
        },
      },
    };
  }
}

export { RoomModel };
