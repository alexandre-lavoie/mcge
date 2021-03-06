import "reflect-metadata";
require('dotenv').config({path: './.env'});

import express from 'express';
import next from 'next';
import socketio from 'socket.io';
import http from 'http';
import Server from "./components/Server";

const nextApp = next({dev: process.env.ENV !== `production`});
const handle = nextApp.getRequestHandler();

const PORT = process.env.PORT || 3000;

nextApp.prepare()
.then(async () => {
    const app = express() as any;
    const server = http.createServer(app);

    const io = socketio(server);

    app.use(express.static('public'));

    app.get('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(PORT, () => {
        console.log(`> Express: ${PORT}`);
    });

    let ioServer = new Server(io);
}).catch(ex => {
    console.error(ex.stack);
    process.exit(1);
});