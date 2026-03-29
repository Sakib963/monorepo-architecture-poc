import { Router } from 'express';
import { createRoutes } from './create.routes';
import { readRoutes } from './read.routes';
import { actionRoutes } from './action.routes';

export const notificationRouter = Router();

notificationRouter.use(createRoutes);
notificationRouter.use(actionRoutes);
notificationRouter.use(readRoutes);
