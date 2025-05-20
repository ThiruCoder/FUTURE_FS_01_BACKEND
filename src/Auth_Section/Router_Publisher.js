import express from 'express'
import { GetAllUser, UpdateRole, UpdateUser, UserLogin, UserRegister } from './Publisher.js';
import { VerifyToken } from '../middlewares/VerifyToken.js';

const userRouter = express.Router();

userRouter.post('/login', UserLogin);
userRouter.post('/register', UserRegister);
userRouter.put('/roleUpdate', UpdateRole)
userRouter.get('/getAllUsers', GetAllUser)
userRouter.post('/UpdateUser', UpdateUser)
userRouter.post('/VerifyToken', VerifyToken)

export { userRouter }