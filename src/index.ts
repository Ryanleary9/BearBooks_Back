import http from 'http';
import createDebug from 'debug';
import { app } from './app.js';
import { dbConnect } from './db/db.connect.js';

const debug = createDebug('BB:Index');

const PORT = process.env.PORT || 4500;

const server = http.createServer(app);

dbConnect()
  .then((mongoose) => {
    server.listen(PORT);
    debug('DB: ', mongoose.connection.db.databaseName);
  })
  .catch((error) => server.emit('error', error));

server.on('error', (error) => {
  debug('Server error: ', error.message);
});

server.on('listening', () => {
  const adress = server.address();
  if (adress === null) return;
  let bind: string;
  if (typeof adress === 'string') {
    bind = 'pipe' + adress;
  } else {
    bind =
      adress.address === '::'
        ? `http://localhost:${adress?.port}`
        : `port ${adress?.port}`;
  }

  debug(`Listening on ${bind}`);
});
