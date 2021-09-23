import indexRoutes from './routes';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';
import express, { Request, Response, NextFunction, Express } from 'express';
import helmet from 'helmet';
import path from 'path';
import jwt from 'express-jwt';

const securedMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.sendStatus(400);
    next();
};

type HandleCallback = (req: Request, res: Response) => Promise<void>;

// helpers
function ignoreFavicon(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl.includes('favicon.ico')) {
        return res.status(204).end();
    }
    return next();
}

export default (config: AppConfig, handle: HandleCallback): Express => {
    const app = express();

    // configure the server
    app.use(helmet());
    app.use(cookieParser());
    app.use(ignoreFavicon);
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(
        jwt({
            algorithms: ['HS256'],
            credentialsRequired: false,
            secret: config.JWT_SECRET,
            getToken: (req) => req.cookies.token,
        })
    );
    app.use('/', indexRoutes);
    app.use('/auth', authRoutes);
    app.use('/secured', securedMiddleware);

    app.all('*', (req, res) => {
        return handle(req, res);
    });

    return app;
};
