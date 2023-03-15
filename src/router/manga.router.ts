import { Router } from 'express';
import { AuthInterceptor } from '../interceptors/auth.interceptors.js';
import { MangaMongoRepo } from '../repository/manga/manga.mongo.repo.js';
import { MangaController } from '../controller/manga.controller.js';

// eslint-disable-next-line new-cap
export const mangaRouter = Router();
const mangaRepo = MangaMongoRepo.getInstance();
const controller = new MangaController(mangaRepo);
const interceptor = new AuthInterceptor(mangaRepo);

mangaRouter.get('/list', controller.getMangas.bind(controller));
mangaRouter.get('/list/:id', controller.getMangaOne.bind(controller));
mangaRouter.post(
  '/add',
  interceptor.logged,
  interceptor.admin,
  controller.newManga.bind(controller)
);
mangaRouter.post(
  '/add',
  interceptor.logged,
  interceptor.admin,
  controller.newManga.bind(controller)
);
mangaRouter.patch(
  '/update/:id',
  interceptor.logged,
  interceptor.admin,
  controller.changeManga.bind(controller)
);
mangaRouter.delete(
  '/delete/:id',
  interceptor.logged,
  interceptor.admin,
  controller.destroyManga.bind(controller)
);
