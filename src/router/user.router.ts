import { Router } from 'express';
import { UserMongoRepo } from '../repository/user/user.mongo.repo';

// eslint-disable-next-line new-cap
export const userRouter = Router();
const userRepo = UserMongoRepo.getInstance();
const controller;
