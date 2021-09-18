// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='../models/common.d.ts' />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='./models/app.d.ts' />
import { app, server, io } from './app';
import socketHandler from './lib/socket';

import controllers from './controllers';
import express from 'express';
import next from 'next';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const PORT = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
console.log('dev', dev);
const nextApp = next({
    dev,
    dir: path.join( __dirname, '../client')
});
const handle = nextApp.getRequestHandler();

io.on('connection', (socket) => socketHandler(socket as CustomSocket, io));


// console.log('client folder', path.join( __dirname, '../client'));
// configure the server
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', controllers);


nextApp.prepare().then(() => {
    app.all('*', (req, res) => {
        return handle(req, res)
    });

    server.listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`)
    })
});
