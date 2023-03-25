import { Manga } from '../entities/manga';
import { User } from '../entities/user';
import { RequestPlus } from '../interceptors/auth.interceptors';
import { MangaRepo } from '../repository/manga/manga.repo.interface';
import { UserRepo } from '../repository/user/user.repo.interface';
import { Auth } from '../services/auth';
import { UsersController } from './user.controller';
import { Request, Response } from 'express';

jest.mock('../services/auth');

describe('Given the UserController ', () => {
  const mockRepo = {
    query: jest.fn(),
    queryID: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as UserRepo<User>;

  const mockMangaRepo = {
    getAllMangas: jest.fn(),
    getOneManga: jest.fn(),
    searchManga: jest.fn(),
    createManga: jest.fn(),
    updateManga: jest.fn(),
    deleteManga: jest.fn(),
  } as unknown as MangaRepo<Manga>;

  const controller = new UsersController(mockRepo, mockMangaRepo);

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();

  const mockUser = {
    id: 'asda',
    email: 'asda',
    role: 'user',
    kart: [],
  };

  const mockUserAddManga = {
    id: 'asda',
    email: 'asda',
    role: 'user',
    kart: ['sadadas'],
  };

  describe('When query method is called  ', () => {
    const req = {} as unknown as Request;
    test('Then if the user information is completed, resp.json should be called ', async () => {
      await controller.query(req, resp, next);

      expect(mockRepo.query).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if the query method throws an error it should execute next function', async () => {
      (mockRepo.query as jest.Mock).mockRejectedValue('Error');

      await controller.query(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the register method is called ', () => {
    test('Then if the user information is completed it shoudl return, th  resp.status, and the resp.json ', async () => {
      const req = {
        body: {
          name: 'asdadas@aefa.es',
          surname: 'asdadas',
          email: 'asdada@gmes.es',
          passwd: 'asdasdasd',
          pfp: 'asdasda',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then if the password is missing, it should execute the next function', async () => {
      const req = {
        body: {
          name: 'asdadas@aefa.es',
          surname: 'asdadas',
          email: 'asdada@gmes.es',
          pfp: 'asdasda',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    test('Then if the email is missing, it should execute the next function', async () => {
      const req = {
        body: {
          name: 'asdadas@aefa.es',
          surname: 'asdadas',
          passwd: 'asdasdasd',
          pfp: 'asdasda',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    test('Then if the email and password is missing, it should execute the next function ', async () => {
      const req = {
        body: {
          name: 'asdadas@aefa.es',
          surname: 'asdadas',
          pfp: 'asdasda',
        },
      } as unknown as Request;

      await controller.register(req, resp, next);
      expect(mockRepo.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the login method is used ', () => {
    test('Then if the user information is compelted,  it shoudl return the resp.status and resp.json ', async () => {
      const req = {
        body: {
          email: 'test',
          passwd: 'test',
        },
      } as unknown as Request;

      (mockRepo.search as jest.Mock).mockResolvedValue(['test']);

      Auth.compare = jest.fn().mockResolvedValue(true);

      await controller.login(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then if the user information has no email it should execute the next function', async () => {
      const req = {
        body: {
          passwd: 'asdasd',
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then if the password is incorrect, it should execute the next function', async () => {
      const req = {
        body: {
          email: 'asdasd',
        },
      } as unknown as Request;

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then if the email is not found, it should execute the next function', async () => {
      const req = {
        body: {
          email: 'test',
          passwd: 'test',
        },
      } as unknown as Request;

      (mockRepo.search as jest.Mock).mockResolvedValue(['test']);

      Auth.compare = jest.fn().mockResolvedValue(false);

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then if the user information is compelted,  it shoudl return the resp.status and resp.json ', async () => {
      const req = {
        body: {
          email: 'test',
          passwd: 'test',
        },
      } as unknown as Request;

      (mockRepo.search as jest.Mock).mockResolvedValue([]);

      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('when the add to kart method is used', () => {
    const req = {
      info: {
        id: 'asda',
        email: 'asda',
        role: 'user',
      },
      params: {
        id: 'sadadas',
      },
    } as unknown as RequestPlus;
    test('Then it should add manga to kart ', async () => {
      (mockRepo.queryID as jest.Mock).mockResolvedValue(mockUser);

      (mockMangaRepo.getOneManga as jest.Mock).mockResolvedValue({
        id: 'sadadas',
      });

      (mockRepo.update as jest.Mock).mockResolvedValue({
        id: 'asda',
        email: 'asda',
        role: 'user',
        kart: ['sadadas'],
      });

      await controller.addMangaKart(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then if there isnt any id in params it should throw an error', async () => {
      const req = {
        info: {
          id: 'asda',
          email: 'asda',
          role: 'user',
        },
        params: {
          id: undefined,
        },
      } as unknown as RequestPlus;

      (mockRepo.queryID as jest.Mock).mockResolvedValue(mockUser);

      (mockMangaRepo.getOneManga as jest.Mock).mockResolvedValue({
        id: undefined,
      });

      (mockRepo.update as jest.Mock).mockResolvedValue({
        id: 'asda',
        email: 'asda',
        role: 'user',
        kart: [undefined],
      });

      await controller.addMangaKart(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then if the the manga that ur looking for doesnt exists it should throww an error ', async () => {
      (mockRepo.queryID as jest.Mock).mockResolvedValue(mockUser);

      (mockMangaRepo.getOneManga as jest.Mock).mockResolvedValue(undefined);

      (mockRepo.update as jest.Mock).mockResolvedValue(mockUser);

      await controller.addMangaKart(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then if you are not logged in and you try to add a manga it should throw an error ', async () => {
      const req = {
        params: {
          id: '123',
        },
      } as unknown as RequestPlus;

      (mockRepo.queryID as jest.Mock).mockResolvedValue({});

      (mockMangaRepo.getOneManga as jest.Mock).mockResolvedValue({
        id: '2',
      });

      (mockRepo.update as jest.Mock).mockResolvedValue({});

      await controller.addMangaKart(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('Given the delete kart mehtod', () => {
    const req = {
      info: {
        id: 'asda',
        email: 'asda',
        role: 'user',
      },
      params: {
        id: 'sadadas',
      },
    } as unknown as RequestPlus;
    test('Then it should delete manga from kart ', async () => {
      (mockRepo.queryID as jest.Mock).mockResolvedValue(mockUserAddManga);

      (mockMangaRepo.getOneManga as jest.Mock).mockResolvedValue({
        id: 'sadadas',
      });

      (mockRepo.update as jest.Mock).mockResolvedValue(mockUser);

      await controller.deleteKartManga(req, resp, next);
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then when its not given any data in the info payload it should throw an error ', async () => {
      const req = {
        params: {
          id: 'sadadas',
        },
      } as unknown as RequestPlus;

      (mockRepo.queryID as jest.Mock).mockResolvedValue(mockUserAddManga);

      (mockMangaRepo.getOneManga as jest.Mock).mockResolvedValue({
        id: 'sadadas',
      });

      (mockRepo.update as jest.Mock).mockResolvedValue(mockUser);

      await controller.deleteKartManga(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then it tries to find a manga that doesnt exists it should throw an error', async () => {
      (mockRepo.queryID as jest.Mock).mockResolvedValue(mockUser);

      (mockMangaRepo.getOneManga as jest.Mock).mockResolvedValue(undefined);

      (mockRepo.update as jest.Mock).mockResolvedValue(mockUser);

      await controller.deleteKartManga(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then it tries to find a manga with the wrong id it should throw an error ', async () => {
      const req = {
        params: {
          id: '123',
        },
      } as unknown as RequestPlus;

      (mockRepo.queryID as jest.Mock).mockResolvedValue({});

      (mockMangaRepo.getOneManga as jest.Mock).mockResolvedValue({
        id: '2',
      });

      (mockRepo.update as jest.Mock).mockResolvedValue({});

      await controller.deleteKartManga(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('Then when there isnt a id in params it should throw an error ', async () => {
      const req = {
        info: {
          id: 'asda',
          email: 'asda',
          role: 'user',
        },
        params: {
          id: undefined,
        },
      } as unknown as RequestPlus;

      (mockRepo.queryID as jest.Mock).mockResolvedValue(mockUser);
      (mockMangaRepo.getOneManga as jest.Mock).mockResolvedValue({
        id: undefined,
      });

      await controller.deleteKartManga(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
