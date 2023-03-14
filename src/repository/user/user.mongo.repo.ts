import createDebug from 'debug';
import { HTTPError } from '../../errors/errors.js';
import { User } from '../../entities/user.js';
import { UserModel } from './user.mongo.model.js';
import { UserRepo } from './user.repo.interface.js';

const debug = createDebug('BB:user ');

export class UserMongoRepo implements UserRepo<User> {
  private static instanced: UserMongoRepo;

  public static getInstance(): UserMongoRepo {
    if (!UserMongoRepo.instanced) {
      UserMongoRepo.instanced = new UserMongoRepo();
    }

    return UserMongoRepo.instanced;
  }

  private constructor() {
    debug('Instantiate User');
  }

  async query(): Promise<User[]> {
    const data = await UserModel.find();
    return data;
  }

  async queryID(id: string): Promise<User> {
    const data = await UserModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found');
    return data;
  }

  async create(info: Partial<User>): Promise<User> {
    const data = await UserModel.create(info);
    return data;
  }

  async update(info: Partial<User>): Promise<User> {
    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    });

    if (!data)
      throw new HTTPError(402, 'Not possible', 'Was not possible to update');
    return data;
  }

  async delete(id: string): Promise<void> {
    const data = await UserModel.findByIdAndDelete(id);
    if (!data)
      throw new HTTPError(402, 'Not possible', 'Delete was not possible');
  }
}
