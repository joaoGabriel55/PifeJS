import { transaction } from "objection";
import { Room } from "../domain/room.js";
import { RoomModel } from "../infra/database/models/roomModel.js";
import { BaseRepository } from "./baseRepository.js";

const parseRoom = (roomModel: RoomModel): Room => {
  return {
    id: roomModel.id,
    name: roomModel.name,
    owner: {
      id: roomModel.owner.id,
      name: roomModel.owner.name,
      email: roomModel.owner.email,
    },
    players: !roomModel.players
      ? []
      : roomModel.players.map((player) => ({
          id: player.id,
          name: player.name,
          email: player.email,
        })),
    createdAt: roomModel.createdAt,
    updatedAt: roomModel.updatedAt,
  };
};

export class RoomsRepository extends BaseRepository<Room> {
  async find(id: string): Promise<Room | null> {
    const roomModel = await RoomModel.query()
      .findById(id)
      .withGraphJoined("[owner, players]");

    if (!roomModel) {
      return null;
    }

    return parseRoom(roomModel);
  }

  async index(): Promise<Array<Room>> {
    const rooms = await RoomModel.query().withGraphJoined("[owner, players]");

    return rooms.map(parseRoom);
  }

  async create(roomData: Room): Promise<Room | null> {
    const { owner, players, ...roomDetails } = roomData;

    try {
      const newRoom = await transaction(RoomModel, async (RoomModel) => {
        const room = await RoomModel.query().insert({
          ...roomDetails,
          ownerId: owner.id,
          createdAt: new Date(),
        });

        await room
          .$relatedQuery("players")
          .relate(players.map((player) => player.id));

        return RoomModel.query()
          .findById(room.id)
          .withGraphJoined("[owner, players]");
      });

      return newRoom ? parseRoom(newRoom) : null;
    } catch (e) {
      console.log("Error creating room", e);

      return null;
    }
  }

  async update(id: string, roomData: Partial<Room>): Promise<Room | null> {
    const { owner, players = [], ...roomDetails } = roomData;

    const room = await transaction(RoomModel, async (RoomModel) => {
      const room = await RoomModel.query().patchAndFetchById(id, roomDetails);

      await room.$relatedQuery("players").unrelate();

      if (players.length > 0) {
        await room
          .$relatedQuery("players")
          .relate(players.map((player) => player.id));
      }

      return RoomModel.query().findById(id).withGraphJoined("[owner, players]");
    });

    return room ? parseRoom(room) : null;
  }

  async delete(id: string): Promise<void> {
    await RoomModel.query().deleteById(id);
  }
}
