// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../models/app.d.ts" />
import { app, server, io } from './server';
import socketHandler from './app/socket';

import controllers from './controllers';
import dotenv from 'dotenv';
import express from 'express';
import next from 'next';
dotenv.config();


const PORT = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

io.on("connection", (socket) => socketHandler(socket as any, io));


// configure the server
app.use(express.json());
app.use(express.static('public'));
app.use('/', controllers);


nextApp.prepare().then(() => {
    app.all('*', (req, res) => {
        return handle(req, res)
    });

    server.listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`)
    })
});
