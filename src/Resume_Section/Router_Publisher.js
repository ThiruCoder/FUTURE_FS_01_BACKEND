import express from 'express';
import { VerifyAdminOrUser } from '../middlewares/VerifyToken.js';
import { createResume, getResume, getResumeById, sendMail, updateById } from './Publisher.js';

const resumeRouter = express.Router();

resumeRouter.get('/getResume', getResume);
resumeRouter.get('/getResumeById/:id', getResumeById);
resumeRouter.post('/createResume', VerifyAdminOrUser, createResume);
resumeRouter.put('/updateById/:id', VerifyAdminOrUser, updateById);
resumeRouter.post('/sendMail', sendMail);
// resumeRouter.delete('/deleteProject/:id', VerifyAdminOrUser, deleteProject)

export { resumeRouter }