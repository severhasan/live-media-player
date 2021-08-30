import express from 'express';
import http from 'http';
import socketio from 'socket.io';

const app = express();

// connect socket io
const server = http.createServer(app);
const io = new socketio.Server(server);


export { app, server, io };
