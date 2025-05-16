import { CreateUserDto, UpdateUserDto } from "../domain/user.js";
import { NotFoundError } from "../errors/notFoundError.js";
import UsersRepository from "../repositories/usersRepository.js";
import { generateId } from "../shared/entityId.js";

export class UserService {
  private readonly repository: UsersRepository;

  constructor(repository: UsersRepository) {
    this.repository = repository;
  }

  async getAll() {
    return await this.repository.index();
  }

  async getById(id: string) {
    const user = await this.repository.find(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async create(userData: CreateUserDto) {
    const newUser = { ...userData, id: generateId() };
    return await this.repository.create(newUser);
  }

  async update(id: string, userData: UpdateUserDto) {
    const user = await this.repository.find(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const updatedUser = { ...user, ...userData };
    return await this.repository.update(id, updatedUser);
  }

  async delete(id: string) {
    const user = await this.repository.find(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await this.repository.delete(id);
  }
}
