import mongoose from 'mongoose';
import { config } from '../config.js';
import createDebug from 'debug';
const debug = createDebug('DB: ');

const { cluster, name, passwd, user } = config;

export const dbConnect = (env?: string) => {
  const finalEnv = env || process.env.NODE_ENV;
  const finalDBName = finalEnv === 'test' ? name + '_Testing' : name;

  const uri = `mongodb+srv://${user}:${passwd}@${cluster}/${finalDBName}?retryWrites=true&w=majority`;
  debug(`Connected to: ${uri}`);
  return mongoose.connect(uri);
};
