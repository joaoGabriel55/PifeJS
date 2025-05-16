import {
  CreateRoomDto,
  MAX_PLAYERS,
  Room,
  UpdateRoomDto,
} from "../domain/room.js";
import { NotFoundError } from "../errors/notFoundError.js";
import { ValidationError } from "../errors/validationError.js";
import { RoomsRepository } from "../repositories/roomsRepository.js";
import UsersRepository from "../repositories/usersRepository.js";
import { generateId } from "../shared/entityId.js";

export class RoomsService {
  private readonly roomsRepository: RoomsRepository;
  private readonly usersRepository: UsersRepository;

  constructor(
    roomsRepository: RoomsRepository,
    usersRepository: UsersRepository
  ) {
    this.roomsRepository = roomsRepository;
    this.usersRepository = usersRepository;
  }

  async getById(roomId: string) {
    const room = await this.roomsRepository.find(roomId);

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    return room;
  }

  async getAll() {
    return await this.roomsRepository.index();
  }

  async create(roomData: CreateRoomDto) {
    const owner = await this.usersRepository.find(roomData.owner.id);

    if (!owner) {
      throw new NotFoundError("User not found");
    }

    const playersSet = new Set(roomData.players);
    playersSet.add(owner.id);

    const players = await this.usersRepository.findByIds(
      Array.from(playersSet)
    );

    const newRoom = {
      ...roomData,
      id: generateId(),
      players,
      owner,
      createdAt: new Date(),
    };

    return await this.roomsRepository.create(newRoom);
  }

  async addPlayer(playerId: string, roomId: string) {
    const room = await this.roomsRepository.find(roomId);

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    const player = await this.usersRepository.find(playerId);

    if (!player) {
      throw new NotFoundError("User not found");
    }

    if (room.players.length >= MAX_PLAYERS) {
      throw new ValidationError(["Room is full"]);
    }

    if (room.players.find((player) => player.id === playerId)) {
      throw new ValidationError(["User is already in the room"]);
    }

    room.players.push(player);
    room.updatedAt = new Date();

    return await this.roomsRepository.update(roomId, room);
  }

  async removePlayer(playerId: string, roomId: string) {
    const room = await this.roomsRepository.find(roomId);

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    const player = await this.usersRepository.find(playerId);

    if (!player) {
      throw new NotFoundError("User not found");
    }

    if (!room.players.find((p) => p.id === playerId)) {
      throw new NotFoundError("User not found");
    }

    room.players = room.players.filter((player) => player.id !== playerId);
    room.updatedAt = new Date();

    return await this.roomsRepository.update(roomId, room);
  }

  async update(roomId: string, roomData: UpdateRoomDto) {
    const room = await this.roomsRepository.find(roomId);

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    const updatedRoom = {
      ...roomData,
      updatedAt: new Date(),
    };

    return await this.roomsRepository.update(roomId, updatedRoom);
  }

  async delete(roomId: string) {
    const room = await this.roomsRepository.find(roomId);

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    await this.roomsRepository.delete(roomId);
  }
}
