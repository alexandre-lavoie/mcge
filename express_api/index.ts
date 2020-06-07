import "reflect-metadata";
require('dotenv').config({path: './.env'});

import express from 'express';
import next from 'next';
import socketio from 'socket.io';
import http from 'http';
import Server from "./components/Server";

const nextApp = next({dev: process.env.ENV !== `production`});
const handle = nextApp.getRequestHandler();

nextApp.prepare()
.then(async () => {
    const app = express() as any;
    const server = http.createServer(app);

    const io = socketio(server);

    app.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(80, () => {
        console.log('> Express: http://localhost');
    });

    let ioServer = new Server(io);
}).catch(ex => {
    console.error(ex.stack);
    process.exit(1);
});