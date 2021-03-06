import Room from "./Room";
import Card from "./Card";
import { IPlayer, ICard, IPrompt } from 'mcge';
import CardCollection from "./CardCollection";
import CardHolder from "./CardHolder";

export default class Player implements CardHolder {

    public id: string;
    public socket: SocketIO.Socket;
    private hand: CardCollection;
    private room: Room | null;
    public name: string;
    public isViewer: boolean;

    constructor(socket: SocketIO.Socket) {
        this.socket = socket;
        this.id = socket.id;
        this.hand = new CardCollection();
        this.room = null;
        this.name = '';
        this.isViewer = false;
    }

    public getCards(): CardCollection {
        return this.hand;
    }

    public sendPrompt(prompt: IPrompt) {
        this.socket.emit('prompt', prompt);
    }

    public joinRoom(room: Room) {
        this.room = room;

        this.socket.join(`room-${this.room.id}`);
    }

    public leaveRoom() {
        if(this.room) {
            this.socket.leave(`room-${this.room.id}`);

            this.room = null;
        }
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
        return this.room as Room;
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

    public equals(obj: any) {
        return obj && obj instanceof Player && this.id == obj.id;
    }
}