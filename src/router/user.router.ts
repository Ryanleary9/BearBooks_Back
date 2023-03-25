import { Router } from 'express';
import { UserMongoRepo } from '../repository/user/user.mongo.repo.js';
import { UsersController } from '../controller/user.controller.js';
import { MangaMongoRepo } from '../repository/manga/manga.mongo.repo.js';
import { AuthInterceptor } from '../interceptors/auth.interceptors.js';

// eslint-disable-next-line new-cap
export const userRouter = Router();
const userRepo = UserMongoRepo.getInstance();
const mangaRepo = MangaMongoRepo.getInstance();
const controller = new UsersController(userRepo, mangaRepo);
const interceptor = new AuthInterceptor(mangaRepo);

userRouter.get('/user-list', controller.query.bind(controller));
userRouter.post('/register', controller.register.bind(controller));
userRouter.post('/login', controller.login.bind(controller));
userRouter.patch(
  '/kart/add/:id',
  interceptor.logged,
  controller.addMangaKart.bind(controller)
);

userRouter.patch(
  '/kart/delete/:id',
  interceptor.logged,
  controller.deleteKartManga.bind(controller)
);
