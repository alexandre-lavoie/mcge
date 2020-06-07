import Room from "./Room";
import Card from "./Card";
import { IPlayer, ICard, IPrompt } from '../../components/Interface';
import CardCollection from "./CardCollection";

export default class Player {

    public id: string;
    public socket: SocketIO.Socket;
    private hand: CardCollection;
    private room: Room;
    public name: string;
    public isViewer: boolean;

    constructor(socket: SocketIO.Socket) {
        this.socket = socket;
        this.id = socket.id;
        this.hand = new CardCollection();
        this.room = null;
        this.name = null;
        this.isViewer = false;
    }

    public sendPrompt(prompt: IPrompt) {
        this.socket.emit('prompt', prompt);
    }

    public joinRoom(room: Room) {
        this.room = room;

        this.socket.join(`room-${this.room.id}`);
    }

    public leaveRoom() {
        this.socket.leave(`room-${this.room.id}`);

        this.room = null;
    }

    public draw(card: Card) {
        this.hand.push(card);
    }

    public drawMany(hand: CardCollection) {
        hand.toArray().forEach(card => this.draw(card));
    }

    public hasCard(card: Card | ICard) {
        return this.hand.hasCard(card);
    }

    public getRoom(): Room {
        return this.room;
    }

    public setHand(cards: CardCollection) {
        this.hand.replace(cards);
    }

    public serialize(hidden: boolean = false): IPlayer {
        return {id: this.id, name: this.name, hand: this.hand.serialize(hidden)};
    }

    public getHand() {
        return this.hand;
    }

    public equals(otherPlayer: Player) {
        return otherPlayer && this.id == otherPlayer.id;
    }
}