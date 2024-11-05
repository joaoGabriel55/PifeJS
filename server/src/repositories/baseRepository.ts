export abstract class BaseRepository<T = unknown> {
  async find(id: string): Promise<T | null> {
    throw new Error("Method 'find' not implemented.");
  }

  async findByIds(ids: Array<string>): Promise<Array<T>> {
    throw new Error("Method 'findByIds' not implemented.");
  }

  async index(): Promise<Array<T>> {
    throw new Error("Method 'index' not implemented.");
  }

  async create(entity: T): Promise<T | null> {
    throw new Error("Method 'create' not implemented.");
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    throw new Error("Method 'update' not implemented.");
  }

  async delete(id: string): Promise<void> {
    throw new Error("Method 'delete' not implemented.");
  }
}
