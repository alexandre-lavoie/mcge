import Player from "./Player";
import { IPlayer, ICard, IGameState } from "../../components/Interface";
import Card from "./Card";
import Collection from "./Collection";

export default class PlayerCollection extends Collection<Player> {
    private hidesPlayerCards: boolean;

    constructor(players: Player[] = [], hidesPlayerCards: boolean = true) {
        super(players);
        this.hidesPlayerCards = hidesPlayerCards;
    }

    public findPlayerWith(card: Card | ICard): Player {
        return this.collection.find(player => player.hasCard(card));
    }

    public update(player: Player, gameState: IGameState) {
        player.socket.emit('update', gameState);
    }

    public serialize(player?: Player): IPlayer[] {
        let hidden = this.hidesPlayerCards && player != undefined && !player.isViewer;

        return this.filter(p => !p.isViewer).map(other => other.serialize(hidden && !player.equals(other)));
    }

    public after(player: Player, shift: number=1): Player {
        const players = this.collection.filter(p => !p.isViewer);

        if(!player) {
            return players[0];
        }

        const index = players.findIndex(p => p.id == player.id);

        if(index >= 0) {
            return players[(index + shift) % players.length];
        } else {
            return players[0];
        }
    }

    public before(player: Player, shift: number=1): Player {
        const players = this.collection.filter(p => !p.isViewer);

        if(!player) {
            return players[0];
        }

        const index = players.findIndex(p => p.id == player.id);

        if (index >= 0) {
            let offset = index - shift;

            if(offset < 0) {
                offset = players.length - ((offset * -1) % players.length);
            }

            return players[offset];
        } else {
            return players[0];
        }
    }
}