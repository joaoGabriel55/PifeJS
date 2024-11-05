import { User } from "../../domain/user.js";
import { BaseRepository } from "../baseRepository.js";

export const MOCK_USERS = [
  {
    id: "b9f3147e-f42e-4d5d-9b7f-9f1e62bb22a2",
    name: "Jane Smith",
    email: "jane@example.com",
  },
  {
    id: "c4e8907d-6d78-489e-ae48-f92a4c6f56d4",
    email: "user123@example.com",
  },
  {
    id: "779a9f79-87f6-40a6-a402-b247cb4d1eff",
    name: "John Doe",
    email: "john@example.com",
  },
];

export class MockUsersRepository extends BaseRepository<User> {
  private users: Array<User>;

  constructor(users: Array<User> = MOCK_USERS) {
    super();
    this.users = users;
  }

  async index(): Promise<Array<User>> {
    return this.users;
  }

  async find(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user || null;
  }

  async findByIds(ids: Array<string>): Promise<Array<User>> {
    return this.users.filter((user) => ids.includes(user.id));
  }

  async create(userData: User): Promise<User | null> {
    this.users.push(userData);
    return userData;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return null;

    this.users[userIndex] = { ...this.users[userIndex], ...userData };
    return this.users[userIndex];
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((u) => u.id !== id);
  }
}
