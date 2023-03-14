import { MangaModel } from './manga.mongo.model';
import { MangaMongoRepo } from './manga.mongo.repo';

jest.mock('./manga.mongo.model');

describe('Given the User Repo ', () => {
  const repo = MangaMongoRepo.getInstance();
  describe('When its called ', () => {
    test('Then it should be instanced ', () => {
      expect(repo).toBeInstanceOf(MangaMongoRepo);
    });
  });

  describe('When query is used ', () => {
    test('Then it should return the list of mangas', async () => {
      (MangaModel.find as jest.Mock).mockResolvedValue([]);
      const result = await repo.getAllMangas();

      expect(MangaModel.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('When the method queryID is used ', () => {
    test('Then it should return a user ', async () => {
      (MangaModel.findById as jest.Mock).mockResolvedValue({ id: '1' });
      const id = '1';
      const result = await repo.getOneManga(id);
      expect(MangaModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
  });
  describe('When the method queryID is used and the id is wrong', () => {
    test('Then it should throw an error ', async () => {
      (MangaModel.findById as jest.Mock).mockResolvedValue(undefined);
      const id = '2';
      expect(async () => repo.getOneManga(id)).rejects.toThrow();
      expect(MangaModel.findById).toHaveBeenCalled();
    });
  });

  describe('Given the search method', () => {
    test('Then it should search with a keyword ', async () => {
      (MangaModel.find as jest.Mock).mockResolvedValue({
        key: 'manga',
        value: 'berserk',
      });
      const result = await repo.searchManga({
        key: 'manga',
        value: 'bersrerk',
      });
      expect(MangaModel.find).toHaveBeenCalled();
      expect(result).toEqual({ key: 'manga', value: 'berserk' });
    });
  });

  describe('when the method create is used  ', () => {
    test('Then it should create the user', async () => {
      (MangaModel.create as jest.Mock).mockResolvedValue([
        {
          id: 'string',
          image: 'string',
          name: 'string',
          description: 'string',
          author: 'string',
          category: 'string',
          firstChap: ['asda'],
        },
      ]);

      const mockUser = {
        id: 'string',
        image: 'string',
        name: 'string',
        description: 'string',
        author: 'string',
        category: 'string',
        firstChap: ['asda'],
      };
      const result = await repo.createManga(mockUser);
      expect(MangaModel.create).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('when the method updated is used  ', () => {
    test('Then it should update the property of choice of the id updated ', async () => {
      (MangaModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        id: '2',
        name: 'Juan',
      });
      const mockUser = {
        id: '2',
        name: 'Juan',
      };
      const result = await repo.updateManga(mockUser);

      expect(MangaModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({
        id: '2',
        name: 'Juan',
      });
    });
  });

  describe('when the method updated is used when the id you  have choseing doesnt work ', () => {
    test('Then it should throw an error 402', async () => {
      (MangaModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);
      const mockUser = {
        id: '1',
      };

      expect(() => repo.updateManga(mockUser)).rejects.toThrow();
      expect(MangaModel.findByIdAndUpdate).toHaveBeenCalled();
    });
  });

  describe('Given the delete method ', () => {
    test('Then it should delete the user for sure ', async () => {
      (MangaModel.findByIdAndDelete as jest.Mock).mockResolvedValue([{}]);
      await repo.deleteManga('1');
      expect(MangaModel.findByIdAndDelete).toHaveBeenCalled();
    });
    test('Then it should delete the user ', () => {
      (MangaModel.findByIdAndDelete as jest.Mock).mockResolvedValue(undefined);
      const mockUsers = '1';

      expect(() => repo.deleteManga(mockUsers)).rejects.toThrow();
      expect(MangaModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });
});
