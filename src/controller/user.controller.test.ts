import { User } from '../entities/user';
import { UserRepo } from '../repository/user/user.repo.interface';
import { Auth } from '../services/auth';
import { UsersController } from './user.controller';
import { NextFunction, Request, Response } from 'express';

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

  const controller = new UsersController(mockRepo);

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();

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
    test('Then if the user information is completed it shoudl return, th  resp.status, and the resp.json ', async () => {
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
    test('Then if the user information is completed it shoudl return, th  resp.status, and the resp.json ', async () => {
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
    test('Then if the user information is completed it shoudl return, th  resp.status, and the resp.json ', async () => {
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
    test('Then if the user information has no password it should execute the next function', async () => {
      const req = {
        body: {
          email: 'asdasd',
        },
      } as unknown as Request;

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
});
