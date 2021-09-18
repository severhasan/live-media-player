import express, { Request, Response, NextFunction, Express } from 'express';
import controllers from './controllers';
import path from 'path';

type HandleCallback = (req: Request, res: Response) => Promise<void>;

// helpers
function ignoreFavicon(req: Request, res: Response, next: NextFunction) {
    if (req.originalUrl.includes('favicon.ico')) {
        return res.status(204).end();
    }
    return next();
}

export default (handle: HandleCallback): Express => {
    const app = express();

    // configure the server
    app.use(ignoreFavicon);
    app.use(express.json());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/', controllers);

    app.all('*', (req, res) => {
        return handle(req, res);
    });

    return app;
};
