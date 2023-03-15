import { Manga } from '../entities/manga';
import { MangaRepo } from '../repository/manga/manga.repo.interface';
import { Auth } from '../services/auth';
import { MangaController } from './manga.controller';
import { Request, Response } from 'express';

jest.mock('../services/auth');

describe('Given the UserController ', () => {
  const mockRepo = {
    getAllMangas: jest.fn(),
    getOneManga: jest.fn(),
    searchManga: jest.fn(),
    createManga: jest.fn(),
    updateManga: jest.fn(),
    deleteManga: jest.fn(),
  } as unknown as MangaRepo<Manga>;

  const controller = new MangaController(mockRepo);

  const resp = {
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();

  describe('When getMangas is used ', () => {
    const req = {} as unknown as Request;
    test('Then it should send json data if there are no errors ', async () => {
      await controller.getMangas(req, resp, next);
      expect(mockRepo.getAllMangas).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there are any errors it should call next ', async () => {
      (mockRepo.getAllMangas as jest.Mock).mockRejectedValue('Error');
      await controller.getMangas(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When getOneManga is used ', () => {
    const req = {
      body: {},
      params: { id: '' },
    } as unknown as Request;
    test('Then it should send json data if there are no errors ', async () => {
      await controller.getMangaOne(req, resp, next);
      expect(mockRepo.getOneManga).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there are any errors it should call next ', async () => {
      (mockRepo.getOneManga as jest.Mock).mockRejectedValue('Error');
      await controller.getMangaOne(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When searchManga is used ', () => {
    const req = {
      body: {},
      params: { id: '' },
    } as unknown as Request;
    test('Then it should send json data if there are no errors ', async () => {
      await controller.lookManga(req, resp, next);
      expect(mockRepo.searchManga).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there are any errors it should call next ', async () => {
      (mockRepo.searchManga as jest.Mock).mockRejectedValue('Error');
      await controller.lookManga(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When createManga is used ', () => {
    const req = {
      body: {},
      params: { id: '' },
    } as unknown as Request;
    test('Then it should send json data if there are no errors ', async () => {
      await controller.newManga(req, resp, next);
      expect(mockRepo.createManga).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there are any errors it should call next ', async () => {
      (mockRepo.createManga as jest.Mock).mockRejectedValue('Error');
      await controller.newManga(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When updateManga is used ', () => {
    const req = {
      body: {},
      params: { id: '' },
    } as unknown as Request;
    test('Then it should send json data if there are no errors ', async () => {
      await controller.changeManga(req, resp, next);
      expect(mockRepo.updateManga).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then it should send json data if the id is in the body', async () => {
      req.params.id = '1';
      delete req.body.id;
      await controller.changeManga(req, resp, next);
      expect(mockRepo.updateManga).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there are any errors it should call next ', async () => {
      (mockRepo.updateManga as jest.Mock).mockRejectedValue('Error');
      await controller.changeManga(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When deleteManga is used ', () => {
    const req = {
      body: {},
      params: { id: '' },
    } as unknown as Request;
    test('Then it should send json data if there are no errors ', async () => {
      await controller.destroyManga(req, resp, next);
      expect(mockRepo.deleteManga).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there are any errors it should call next ', async () => {
      (mockRepo.deleteManga as jest.Mock).mockRejectedValue('Error');
      await controller.destroyManga(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
