// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='../../models/common.d.ts' />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='../types/app.d.ts' />

import socketHandler from '../lib/socket';
import config from '../config';
import createApp from '../app';
import http from 'http';
import livePlayer from '../lib/LivePlayer';
import mongoose from 'mongoose';
import next from 'next';
import path from 'path';
import socketio from 'socket.io';

const nextApp = next({
    dev: config.dev,
    dir: path.join(__dirname, '../../client'),
});
const handle = nextApp.getRequestHandler();
const app = createApp(config, handle);

// create server and initiate socket.io
const server = http.createServer(app);

// configure socket
const io = new socketio.Server(server);
livePlayer.setIo(io);
io.on('connection', (socket) => socketHandler(socket as CustomSocket, io));

// connect Database
mongoose
    .connect(config.DB_URI)
    .then(() => {
        console.info('Connected to MongoDB');
    })
    .catch((error) => {
        console.error(error);
    });

nextApp
    .prepare()
    .then(() => {
        server.listen(config.PORT, () => {
            console.log(`> Ready on http://localhost:${config.PORT}`);
        });
    })
    .catch((err) => {
        console.error(err);
    });
