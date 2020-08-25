import "reflect-metadata";

import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import Server from "./components/Server";
import path from 'path';

const PORT = process.env.PORT || 3000;

(async () => {
    const app = express() as any;
    const server = http.createServer(app);

    const io = socketio(server);

    app.use(express.static(path.resolve(__dirname, '../out')));

    app.use('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../out/index.html'));
    })

    server.listen(PORT, () => {
        console.log(`> Express: ${PORT}`);
    });

    let ioServer = new Server(io);
})();