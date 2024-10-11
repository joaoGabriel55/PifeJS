import { User } from "../../domain/user.js";
import { IRepository } from "../IRepository.js";

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

export class MockUsersRepository implements IRepository<User> {
  private users;

  constructor(users: Array<User> = MOCK_USERS) {
    this.users = users;
  }

  async index() {
    return this.users;
  }

  async find(id: string) {
    const user = this.users.find((u) => u.id === id);

    if (user) return user;

    return null;
  }

  async create(userData: User) {
    return userData;
  }

  async update(id: string, userData: User) {
    return userData;
  }

  async delete(id: string) {
    this.users = this.users.filter((u) => u.id !== id);
  }
}
