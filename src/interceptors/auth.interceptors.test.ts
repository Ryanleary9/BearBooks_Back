import { Response } from 'express';
import { AuthInterceptor, RequestPlus } from './auth.interceptors';
import { Auth } from '../services/auth';
import { HTTPError } from '../errors/errors';
import { MangaRepo } from '../repository/manga/manga.repo.interface';
import { Manga } from '../entities/manga';

jest.mock('../services/auth');

describe('Given AuthInterceptor class', () => {
  const repo: MangaRepo<Manga> = {
    createManga: jest.fn(),
    getAllMangas: jest.fn(),
    getOneManga: jest.fn(),
    updateManga: jest.fn(),
    deleteManga: jest.fn(),
    searchManga: jest.fn(),
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

  describe('When logged is used', () => {
    test('Then it should send next if there are NOT Authorization header ', () => {
      (req.get as jest.Mock).mockReturnValue(null);
      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
    test('Then it should send next if Authorization header is BAD formatted', () => {
      (req.get as jest.Mock).mockReturnValue('BAD token');
      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
    test('Then it should send next if Authorization token is NOT valid', () => {
      Auth.getTokenPayload = jest.fn().mockReturnValue('Invalid token');
      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(Error));
    });
    test('Then it should send next if Authorization token is valid', () => {
      (req.get as jest.Mock).mockReturnValue('Bearer token');
      Auth.getTokenPayload = jest.fn().mockReturnValue({});
      interceptor.logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith();
    });
  });

  describe('When admin is used', () => {
    test('Then it should send next(error) if there are NOT Authorization header ', () => {
      req.info = undefined;
      interceptor.admin(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
    test('Then it should send next(error) if the user role is noT admin', () => {
      req.info = { id: '', email: '', role: 'user' };
      interceptor.admin(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
    test('Then it should send next(error) if the user role is noT admin', () => {
      req.info = { id: '', email: '', role: 'admin' };
      interceptor.admin(req, resp, next);
      expect(next).toHaveBeenLastCalledWith();
    });
  });
});
