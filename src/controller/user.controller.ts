import createDebug from 'debug';
import { UserRepo } from '../repository/user/user.repo.interface.js';
import { User } from '../entities/user.js';
import { NextFunction, Response, Request } from 'express';
import { HTTPError } from '../errors/errors.js';
import { Auth, PayloadToken } from '../services/auth.js';
import { RequestPlus } from '../interceptors/auth.interceptors.js';
import { Manga } from '../entities/manga.js';
import { MangaRepo } from '../repository/manga/manga.repo.interface.js';

const debug = createDebug('BB:controller:user');
export class UsersController {
  constructor(public repo: UserRepo<User>, public mangaRepo: MangaRepo<Manga>) {
    debug('instantiate');
  }

  async query(_req: Request, resp: Response, next: NextFunction) {
    try {
      const data = await this.repo.query();
      resp.json({
        results: data,
      });
    } catch (error) {
      next();
    }
  }

  async register(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('register:post');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      req.body.passwd = await Auth.hash(req.body.passwd);
      req.body.kart = [];
      debug('REQBODY TEST', req.body);
      const data = await this.repo.create(req.body);
      debug('REQBODY pepe', req.body);
      resp.status(201);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('login');
      if (!req.body.email || !req.body.passwd)
        throw new HTTPError(401, 'Unauthorized', 'Invalid Email or password');
      const data = await this.repo.search({
        key: 'email',
        value: req.body.email,
      });
      if (!data.length)
        throw new HTTPError(401, 'Unauthorized', 'Email not found');
      if (!(await Auth.compare(req.body.passwd, data[0].passwd)))
        throw new HTTPError(401, 'Unauthorized', 'Password not match');
      const payload: PayloadToken = {
        id: data[0].id,
        email: data[0].email,
        role: 'admin',
      };
      debug('Payload');
      const token = Auth.createJWT(payload);
      resp.status(202);
      resp.json({
        results: [token, data[0]],
      });
    } catch (error) {
      next(error);
    }
  }

  async addMangaKart(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      if (!req.info)
        throw new HTTPError(
          401,
          'Not Authorized',
          'Couldn`t find user id in token info'
        );
      debug('add-manga', req.info);
      const actualUser = await this.repo.queryID(req.info.id);
      debug('add-manga test');
      debug(actualUser);
      if (!req.params.id)
        throw new HTTPError(404, 'ID not found', 'ID not found in params');
      const mangaToAdd = await this.mangaRepo.getOneManga(req.params.id);
      debug('mangaID TEst CONTROLLER', mangaToAdd);
      if (!mangaToAdd)
        throw new HTTPError(404, 'Not found', 'Manga not found in database');

      actualUser.kart.push(mangaToAdd.id.toString());
      debug('CONTROLLER KART TYPE TEST', actualUser);
      await this.repo.update(actualUser);

      resp.status(202);
      resp.json({
        results: [actualUser],
      });
    } catch (error) {
      debug('ERROR CONTROLLER MANGA');
      next(error);
    }
  }

  async deleteKartManga(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      if (!req.info)
        throw new HTTPError(
          401,
          'Not Authorized',
          'Couldn`t find user id in token info'
        );
      debug('add-manga', req.info);
      const actualUser = await this.repo.queryID(req.info.id);
      debug('add-manga test');
      debug(actualUser);
      if (!req.params.id)
        throw new HTTPError(404, 'ID not found', 'ID not found in params');
      const mangaToAdd = await this.mangaRepo.getOneManga(req.params.id);
      if (!mangaToAdd)
        throw new HTTPError(404, 'Not found', 'Manga not found in database');

      debug('MANGA ID', mangaToAdd);

      const newUser = actualUser.kart.filter(
        (item) => item.toString() !== mangaToAdd.id
      );
      console.log(newUser);
      actualUser.kart = newUser;
      const newActualUser = await this.repo.update(actualUser);

      resp.status(202);
      resp.json({
        results: [newActualUser],
      });
    } catch (error) {
      next(error);
    }
  }
}
