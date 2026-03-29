import { Router } from 'express';
import { readRoutes } from './read.routes';
import { profileTransferRoutes } from './profile-transfer.routes';
import { userManagementRoutes } from './user-management.routes';
import { adminActionRoutes } from './admin-actions.routes';

export const userRouter = Router();

userRouter.use(readRoutes);
userRouter.use(profileTransferRoutes);
userRouter.use(adminActionRoutes);
userRouter.use(userManagementRoutes);
