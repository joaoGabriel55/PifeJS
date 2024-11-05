import { Model, ModelObject } from "objection";
import { RoomModel } from "./roomModel.js";

class UserModel extends Model {
  static tableName = "users";

  id!: string;
  email!: string;
  name?: string;

  ownedRooms?: RoomModel[];
  rooms?: RoomModel[];

  static jsonSchema = {
    type: "object",
    required: ["email", "id"],
    properties: {
      id: { type: "string", format: "uuid" },
      email: { type: "string", format: "email" },
      name: { type: "string" },
    },
  };

  static get relationMappings() {
    return {
      rooms: {
        relation: Model.ManyToManyRelation,
        modelClass: RoomModel,
        join: {
          from: "users.id",
          through: {
            from: "room_players.playerId",
            to: "room_players.roomId",
          },
          to: "rooms.id",
        },
        ownedRooms: {
          relation: Model.HasManyRelation,
          modelClass: RoomModel,
          join: {
            from: "users.id",
            to: "rooms.ownerId",
          },
        },
      }
    };
  }
}

export { UserModel };
