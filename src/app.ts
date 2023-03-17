import createDebug from 'debug';
import cors from 'cors';
import express, { NextFunction, Response, Request } from 'express';
import morgan from 'morgan';
import { CustomError } from './errors/errors.js';
import { userRouter } from './router/user.router.js';
import { mangaRouter } from './router/manga.router.js';

const debug = createDebug('BB:app');

export const app = express();
app.disable('x-powered-by');

const corsOptions = {
  origin: '*',
};

app.get('/', (_req, resp) => {
  resp.json({
    name: 'Bear Books API',
    routes: {
      user: {
        route: '/user',
        userRoutes: {
          login: '/login',
          register: '/register',
        },
      },

      manga: {
        route: '/manga',
        mangaRoutes: {
          getMangas: '/list',
          getOneManga: '/list/:id',
          createManga: '/add',
          updateManga: '/update/:id',
          deleteManga: '/delete/:id',
        },
      },
    },
  });
});
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions));

app.use('/users', userRouter);
app.use('/manga', mangaRouter);

app.use(
  (error: CustomError, _req: Request, resp: Response, _next: NextFunction) => {
    debug('Soy el middleware de errores');
    const status = error.statusCode || 500;
    const statusMessage = error.statusMessage || 'Internal server error';
    resp.status(status);
    resp.json({
      error: [
        {
          status,
          statusMessage,
        },
      ],
    });
    debug(status, statusMessage, error.message);
  }
);
