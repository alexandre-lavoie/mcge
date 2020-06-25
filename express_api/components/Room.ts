import Game from './Game';
import Player from './Player';
import Server from './Server';
import { IMove, IResponse } from 'mcge';

export default class Room {
    public id: string;
    protected io: SocketIO.Server;
    protected server: Server;
    public game: Game;
    private nst: SocketIO.Namespace;

    constructor(io: SocketIO.Server, server: Server, game: Game) {
        this.id = '' + Math.random().toString(36).substr(2, 9);
        this.server = server;
        this.io = io;
        this.game = game;
        this.nst = this.io.in(`room-${this.id}`);
    }

    public addEventListeners(player: Player) {
        player.socket.on('getTheme', () => player.socket.emit('getTheme', this.game.getTheme()));

        player.socket.on('getButtons', () => player.socket.emit('getButtons', this.game.getButtons()));

        player.socket.on('move', (move: IMove) => {
            this.game.onPlayerMove(player, move);
        });

        player.socket.on('start', () => {
            if(this.game.phase == 'waiting' && this.game.getPlayerCount() >= this.game.getMinPlayers()) {
                this.game.phase = 'started';

                this.game.start();

                this.game.update();
            }
        });

        player.socket.on('buttonClick', button => {
            if(this.game.onButtonClick(player, button)) {
                this.game.update();
            }
        });

        player.socket.on('prompt', (response: IResponse) => {
            this.game.onPromptResponse(response);
        });
    }

    public removeEventListeners(player: Player) {
        //player.socket.removeAllListeners();
    }

    public handlePlayerJoin(player: Player) {
        console.log(`Player ${player.id} joined room ${this.id}.`);

        player.joinRoom(this);

        this.addEventListeners(player);

        this.game.onPlayerJoin(player);
        
        this.game.update();
    }

    public handlePlayerLeave(player: Player) {
        console.log(`Player ${player.id} left room ${this.id}.`);

        player.leaveRoom();

        this.removeEventListeners(player);

        this.game.onPlayerLeave(player);

        this.game.update();
    }
}