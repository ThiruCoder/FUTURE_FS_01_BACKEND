import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { userRouter } from './Auth_Section/Router_Publisher.js';
import { projectRouter } from './Project_Section/Router_Publisher.js';
import { DatabaseAuthConnection } from './Database_Section/DatabaseAuthConnection.js';
import { authRouter } from './middlewares/AdminAuthorized.js';
import { GlobalError } from './GlobalErrorHandler/GlobalError.js';
import { resumeRouter } from './Resume_Section/Router_Publisher.js';
import { mailRouter } from './Mail_Section/Router_Publisher.js';

const app = express();

const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(helmet())
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
    process.env.FRONTEND_DEV_URL,
    process.env.FRONTEND_PROD_URL,
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            const message = `The CORS policy for this site does not allow access from ${allowedOrigins.join(', ')}`
            return callback(new Error(message), false)
        }
    },
    credentials: true,
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use((err, req, res, next) => {
    if (err.message.includes('CORS policy')) {
        return res.status(403).json({
            error: 'CORS error',
            success: false,
            message: process.env.NODE_ENV === 'development'
                ? err.message : 'Request not allowed from this origin',
            allowedOrigins
        })
    }
    next()
});
DatabaseAuthConnection();

app.use('/auth', userRouter);
app.use('/project', projectRouter);
app.use('/admin', authRouter);
app.use('/resume', resumeRouter);
app.use('/send', mailRouter);


// Cookie test
app.get('/check-cookie', (req, res) => {
    const userToken = req.cookies.token;
    res.status(200).json({ token: (`Token from cookie: ${userToken}`) });
});

// Root route
app.get('/', (req, res) => {
    res.send('Backend Server is running');
});

// 404 handler
app.use((req, res, next) => {
    const err = new Error('Route not found');
    err.statusCode = 404;
    next(err);
});

app.use(GlobalError)

app.listen(PORT, () => {
    console.log(`The port is running on http://localhost:${PORT}`)
})
