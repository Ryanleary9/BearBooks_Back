import createDebug from 'debug';
import { User } from '../entities/user';
import { UserRepo } from '../repository/user/user.repo.interface.js';
import { Response, NextFunction, Request } from 'express';
import { HTTPError } from '../errors/errors.js';
import { Auth } from '../services/auth.js';
import jwt from 'jsonwebtoken';
import { Manga } from '../entities/manga';
import { MangaRepo } from '../repository/manga/manga.repo.interface';
export interface RequestPlus extends Request {
  info?: PayloadToken;
}

export interface PayloadToken extends jwt.JwtPayload {
  id: string;
  email: string;
  role: string;
}

const debug = createDebug('BB:interceptor');

export class AuthInterceptor {
  constructor(public repoUsers: MangaRepo<Manga>) {
    debug('Instantiate');
  }

  logged(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      debug('Called');
      const authHeader = req.get('Authorization');
      if (!authHeader)
        throw new HTTPError(498, 'Token invalid', 'Not value in auth header');
      if (!authHeader.startsWith('Bearer'))
        throw new HTTPError(498, 'Token invalid', 'Not Bearer in auth header');
      const token = authHeader.slice(7);
      const payload = Auth.getTokenPayload(token);
      req.info = payload;
      next();
    } catch (error) {
      next(error);
    }
  }

  admin(req: RequestPlus, resp: Response, next: NextFunction) {
    try {
      if (!req.info)
        throw new HTTPError(401, 'Not autorithed', 'Not info about user');
      if (req.info.role !== 'admin')
        throw new HTTPError(401, 'Not autorithed', 'Not admin role');
      next();
    } catch (error) {
      next(error);
    }
  }
}
