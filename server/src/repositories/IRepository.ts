export interface IRepository<T = unknown> {
  find(id: string): Promise<T | null>;
  index(): Promise<Array<T>>;
  create(entity: T): Promise<T | null>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<void>;
}
