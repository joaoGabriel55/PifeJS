import { generateId } from "../../shared/entityId.js";
import { MOCK_USERS } from "./mockUsersRepository.js";
import { BaseRepository } from "../baseRepository.js";

export const MOCK_ROOMS = [
  {
    id: "b9f3147e-f42e-4d5d-9b7f-9f1e62bb22a2",
    name: "Room 1",
    owner: MOCK_USERS[0],
    players: [MOCK_USERS[0]],
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z",
  },
];

export class MockRoomsRepository extends BaseRepository<any> {
  private rooms: Array<any>;

  constructor(rooms: Array<any> = MOCK_ROOMS) {
    super();
    this.rooms = rooms;
  }

  async index(): Promise<Array<any>> {
    return this.rooms;
  }

  async find(id: string): Promise<any | null> {
    return this.rooms.find((room) => room.id === id) || null;
  }

  async create(roomData: any): Promise<any | null> {
    const newRoom = {
      ...roomData,
      id: generateId(),
    };

    this.rooms.push(newRoom);
    return newRoom;
  }

  async update(id: string, data: Partial<any>): Promise<any | null> {
    const index = this.rooms.findIndex((room) => room.id === id);
    if (index === -1) {
      return null;
    }
    
    this.rooms[index] = { ...this.rooms[index], ...data };
    return this.rooms[index];
  }

  async delete(id: string): Promise<void> {
    this.rooms = this.rooms.filter((room) => room.id !== id);
  }
}
