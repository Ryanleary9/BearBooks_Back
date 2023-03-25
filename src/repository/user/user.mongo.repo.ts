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
    debug(id, 'ID');
    const data = await UserModel.findById(id);
    if (!data) throw new HTTPError(404, 'Not found', 'Id not found');
    if (data.id === undefined) {
      data.id = data._id;
    }

    console.log('REPO MANGA QUERYID', data);
    return data;
  }

  async search(query: { key: string; value: unknown }): Promise<User[]> {
    const data = await UserModel.find({ [query.key]: query.value });
    debug('Data Results', data);
    const result = data.map((item: any) => ({
      ...item._doc,
      id: item._id.toString(),
    }));
    debug('Search Results', result);
    return result;
  }

  async create(info: Partial<User>): Promise<User> {
    const data = await UserModel.create(info);
    debug('REPO USER', data);
    data.id = data._id;
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
