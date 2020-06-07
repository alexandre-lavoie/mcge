import Game from './Game';
import Player from './Player';
import Server from './Server';
import { IMove, IResponse } from '../../components/Interface';

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
        player.socket.on('move', (move: IMove) => {
            this.game.onMove(player, move);
        });

        player.socket.on('start', () => {
            if(this.game.phase == 'waiting' && this.game.getPlayerCount() >= this.game.getMinPlayers()) {
                this.game.start();
            }
        });

        player.socket.on('pass', () => {
            if(this.game.canPass(player)) {
                this.game.onPass(player);
            }
        });

        player.socket.on('prompt', (response: IResponse) => {
            this.game.onPromptResponse(response);
        });
    }

    public removeEventListeners(player: Player) {}

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