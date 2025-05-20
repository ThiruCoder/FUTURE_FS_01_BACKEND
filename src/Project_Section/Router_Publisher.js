import express from 'express';
import { createProject, deleteProject, getProject, getProjectById } from './Publisher.js';
import { uploads } from './uploadImage.js';
import { VerifyAdminOrUser } from '../middlewares/VerifyToken.js';

const projectRouter = express.Router();

projectRouter.get('/getProject', getProject);
projectRouter.post('/createProject', uploads.single('image'), VerifyAdminOrUser, createProject);
projectRouter.delete('/deleteProject/:id', VerifyAdminOrUser, deleteProject)
projectRouter.get('/getProjectById/:id', getProjectById)

export { projectRouter }