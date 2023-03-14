import { UserModel } from './user.mongo.model';
import { UserMongoRepo } from './user.mongo.repo';

jest.mock('./user.mongo.model');

describe('Given the User Repo ', () => {
  const repo = UserMongoRepo.getInstance();
  describe('When its called ', () => {
    test('Then it should be instanced ', () => {
      expect(repo).toBeInstanceOf(UserMongoRepo);
    });
  });

  describe('When query is used ', () => {
    test('Then it should return the list of mangas', async () => {
      (UserModel.find as jest.Mock).mockResolvedValue([]);
      const result = await repo.query();

      expect(UserModel.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When the method queryID is used ', () => {
    test('Then it should return a user ', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue({ id: '1' });
      const id = '1';
      const result = await repo.queryID(id);
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
  });
  describe('When the method queryID is used and the id is wrong', () => {
    test('Then it should throw an error ', async () => {
      (UserModel.findById as jest.Mock).mockResolvedValue(undefined);
      const id = '2';
      expect(async () => repo.queryID(id)).rejects.toThrow();
      expect(UserModel.findById).toHaveBeenCalled();
    });
  });

  describe('when the method create is used  ', () => {
    test('Then it should create the user', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue([
        { email: '2', passwd: '3' },
      ]);

      const mockUser = {
        email: '2',
        passwd: '3',
      };
      const result = await repo.create(mockUser);
      expect(UserModel.create).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('when the method updated is used  ', () => {
    test('Then it should update the property of choice of the id updated ', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        id: '2',
        name: 'Juan',
      });
      const mockUser = {
        id: '2',
        name: 'Juan',
      };
      const result = await repo.update(mockUser);

      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({
        id: '2',
        name: 'Juan',
      });
    });
  });

  describe('when the method updated is used when the id you  have choseing doesnt work ', () => {
    test('Then it should throw an error 402', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);
      const mockUser = {
        id: '1',
      };

      expect(() => repo.update(mockUser)).rejects.toThrow();
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('Given the delete method ', () => {
    test('Then it should delete the user for sure ', async () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue([{}]);
      await repo.delete('1');
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });
    test('Then it should delete the user ', () => {
      (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(undefined);
      const mockUsers = '1';

      expect(() => repo.delete(mockUsers)).rejects.toThrow();
      expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
