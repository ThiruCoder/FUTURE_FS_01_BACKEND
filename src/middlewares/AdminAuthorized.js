import express from 'express'
import { VerifyAdminOrUser } from './VerifyToken.js';
const authRouter = express.Router()

authRouter.get('/log', VerifyAdminOrUser, (req, res) => {
    const data = req.user
    return res.json({
        message: 'Welcome, admin!',
        data: data,
        success: true
    });
})

export { authRouter }