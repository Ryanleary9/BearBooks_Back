export interface UserRepo<U> {
  query(): Promise<U[]>;
  queryID(_id: string): Promise<U>;
  create(_info: Partial<U>): Promise<U>;
  update(_info: Partial<U>): Promise<U>;
  delete(_id: string): Promise<void>;
}
