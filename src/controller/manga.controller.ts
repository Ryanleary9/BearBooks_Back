import createDebug from 'debug';
import { MangaRepo } from '../repository/manga/manga.repo.interface';
import { Manga } from '../entities/manga';
import { Request, Response, NextFunction } from 'express';

const debug = createDebug('BB:controller:manga');

export class MangaController {
  constructor(public repo: MangaRepo<Manga>) {
    debug('instantiate');
  }

  async getMangas(_req: Request, resp: Response, next: NextFunction) {
    try {
      debug('get all manga');
      const data = await this.repo.getAllMangas();
      resp.json({
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMangaOne(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('get 1 manga');
      const data = await this.repo.getOneManga(req.params.id);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async lookManga(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('search for manga');
      const data = await this.repo.searchManga(req.params);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async newManga(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('Create manga');
      const data = await this.repo.createManga(req.body);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async changeManga(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('Update manga');
      req.body.id = req.params.id ? req.params.id : req.body.id;
      const data = await this.repo.updateManga(req.body);
      resp.json({
        results: [data],
      });
    } catch (error) {
      next(error);
    }
  }

  async destroyManga(req: Request, resp: Response, next: NextFunction) {
    try {
      debug('Delete manga');
      await this.repo.deleteManga(req.params.id);
      resp.json({
        results: [],
      });
    } catch (error) {
      next(error);
    }
  }
}
