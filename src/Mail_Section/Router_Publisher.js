import express from 'express';
import { sendMail } from './Publisher.js';

const mailRouter = express.Router();

mailRouter.post('/sendMail', sendMail);

export { mailRouter }