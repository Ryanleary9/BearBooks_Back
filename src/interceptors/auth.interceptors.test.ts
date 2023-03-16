import { Response } from 'express';
import { AuthInterceptor, RequestPlus } from './auth.interceptors';

import { MangaRepo } from '../repository/manga/manga.repo.interface';
import { Manga } from '../entities/manga';

jest.mock('../services/auth');

describe('Given Interceptors class', () => {
  const repo: MangaRepo<Manga> = {
    createManga: jest.fn(),
    getAllMangas: jest.fn(),
    searchManga: jest.fn(),
    getOneManga: jest.fn(),
    updateManga: jest.fn(),
    deleteManga: jest.fn(),
  };
  const interceptor = new AuthInterceptor(repo);

  const req = {
    body: {},
    params: { id: '' },
    get: jest.fn(),
  } as unknown as RequestPlus;
  const resp = {
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  describe('When the Logged method is called', () => {
    test('Then if req.get return undefined, it should be catch and call next function', () => {
      (req.get as jest.Mock).mockReturnValue('');

      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if req.get return string that does not start with Bearer, it should be catch and call next function', () => {
      (req.get as jest.Mock).mockReturnValue('Test');

      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the header Authorization is Ok, it should call next function', () => {
      (req.get as jest.Mock).mockReturnValue('Bearer Test');

      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the Authorized method is called', () => {
    test('Then if the user information is completed, it should return the resp.json', () => {
      const req = {
        info: { id: '1', role: 'admin' },
      } as unknown as RequestPlus;

      interceptor.admin(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the req.info is undefined, it should be catch the error and next function have been called', () => {
      const req = {
        info: undefined,
      } as unknown as RequestPlus;

      interceptor.admin(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the req.params.id is undefined, it should be catch the error and next function have been called', () => {
      const req = {
        info: { id: '1' },
        params: { id: undefined },
      } as unknown as RequestPlus;

      interceptor.admin(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if the req.info.id is not equal to req.params.id, it should be catch the error and next function have been called', () => {
      const req = {
        info: { id: '1' },
        params: { id: '2' },
      } as unknown as RequestPlus;

      interceptor.admin(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
