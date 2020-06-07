import Room from "./Room";
import Player from "./Player";
import Game from "./Game";
import fs from 'fs';

export default class Server {
    private io: SocketIO.Server;
    private rooms: Room[];
    private players: Player[];

    constructor(io: SocketIO.Server) {
        this.io = io;
        this.rooms = [];
        this.players = [];

        this.io.on('connect', socket => {
            let player = this.handlePlayerJoin(socket);

            socket.on('disconnect', () => {
                this.handlePlayerLeave(socket);
            });

            socket.on('joinRoom', roomId => {
                this.handleJoinRoom(socket, roomId);
            });

            socket.on('leaveRoom', () => {
                this.handleLeaveRoom(socket);
            });

            socket.on('createRoom', gameName => {
                let id = this.handleCreateRoom(gameName);

                socket.emit('createRoom', {socket_id: socket.id, room: id});

                socket.broadcast.emit('createRoom', {socket_id: socket.id, room: id});
            });

            socket.on('setName', name => {
                player.name = name; 
            });

            socket.on('getRooms', () => {
                socket.emit('getRooms', this.getRoomIDs());
            });

            socket.on('getGames', () => {
                socket.emit('getGames', this.getGameNames());
            });
        });
    }

    public handlePlayerJoin(socket: SocketIO.Socket): Player {
        let player = new Player(socket);

        console.log(`Player ${player.id} joined.`);

        this.players.push(player);

        return player;
    }

    public handlePlayerLeave(socket: SocketIO.Socket) {
        this.handleLeaveRoom(socket);

        const index = this.players.findIndex(player => player.id === socket.id);

        console.log(`Player ${this.getPlayer(socket).id} left.`);

        if(index >= 0) {
            this.players.splice(index, 1);
        }
    }

    public handleJoinRoom(socket: SocketIO.Socket, roomId: string) {
        socket.join(`room-${roomId}`);

        let player = this.getPlayer(socket);
        let room = this.getRoom(roomId);

        if(room == null) {
            socket.emit('update', null);
        } else {
            room.handlePlayerJoin(player);
        }
    }

    public handleLeaveRoom(socket: SocketIO.Socket) {
        let player = this.getPlayer(socket);

        if(player) {
            let room = player.getRoom();

            if(room) {
                player.getRoom().handlePlayerLeave(player);
            }
        }
    }

    public handleCreateRoom(gameName: string): string {
        let room = new Room(this.io, this, this.getGame(gameName));

        this.rooms.push(room);

        return room.id;
    }

    public getGameNames(): string[] {
        return fs.readdirSync('./express_api/games');
    }

    public getGame(gameName: string): Game {
        let game = require(`../games/${gameName}`).default;

        return new game();
    }

    public getRoomIDs() {
        return this.rooms.filter(room => room.game.phase != 'end' && room.game.getPlayerCount() != 0).map(room => room.id);
    }

    public getRoom(id: string) {
        return this.rooms.find(room => room.id === id);
    }

    public getPlayer(socket: SocketIO.Socket) {
        return this.players.find(player => socket.id === player.id);
    }
}