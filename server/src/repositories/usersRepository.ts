import { UniqueViolationError } from "objection";
import { User } from "../domain/user.js";
import { UserModel } from "../infra/database/models/userModel.js";
import { BaseRepository } from "./baseRepository.js";
import { DuplicateRecordError } from "../errors/duplicateRecordError.js";

export default class UsersRepository extends BaseRepository<User> {
  async find(id: string): Promise<User | null> {
    const user = await UserModel.query().findById(id);
    return user || null;
  }

  async findByIds(ids: Array<string>): Promise<Array<User>> {
    return await UserModel.query().whereIn("id", ids);
  }

  async index(): Promise<Array<User>> {
    return await UserModel.query();
  }

  async create(userData: User): Promise<User | null> {
    try {
      return await UserModel.query().insert(userData);
    } catch (error: any) {
      if (error instanceof UniqueViolationError) {
        throw new DuplicateRecordError(error.message);
      } else {
        throw new Error("Unknown error");
      }
    }
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    return await UserModel.query().patchAndFetchById(id, userData);
  }

  async delete(id: string): Promise<void> {
    await UserModel.query().deleteById(id);
  }
}
