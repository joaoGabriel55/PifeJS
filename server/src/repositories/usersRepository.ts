import { User } from "../domain/user.js";
import { UserModel } from "../infra/database/models/userModel.js";
import { IRepository } from "./IRepository.js";

export default class UsersRepository implements IRepository<User> {
  async find(id: string) {
    const user = await UserModel.query().findById(id);

    if (!user) {
      return null;
    }

    return user;
  }

  async index() {
    return await UserModel.query();
  }

  async create(userData: User) {
    return await UserModel.query().insert(userData);
  }

  async update(id: string, userData: User) {
    return await UserModel.query().patchAndFetchById(id, userData);
  }

  async delete(id: string) {
    await UserModel.query().deleteById(id);
  }
}
