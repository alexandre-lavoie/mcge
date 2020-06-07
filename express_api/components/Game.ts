import Player from "./Player";
import Card from "./Card";
import { IGameState, IMove, ICard, IResponse } from '../../components/Interface';
import CardCollection from "./CardCollection";
import PlayerCollection from "./PlayerCollection";

export default abstract class Game {

    protected players: PlayerCollection;
    protected deck: CardCollection;
    protected centerHand: CardCollection;
    protected currentPlayer: Player;
    public phase: 'waiting' | 'started' | 'end';

    public abstract getName(): string;
    public abstract getMinPlayers(): number;
    public abstract getMaxPlayers(): number;
    public abstract getHidesOtherPlayerCards(): boolean;
    public abstract getDrawSize(): number;
    public abstract checkGameComplete(): boolean;
    public abstract onPromptResponse(response: IResponse);

    constructor() {
        this.players = new PlayerCollection([], this.getHidesOtherPlayerCards());
        this.currentPlayer = null;
        this.phase = 'waiting';
        this.deck = new CardCollection();
        this.centerHand = new CardCollection();
    }

    public start() {
        this.phase = 'started';
        this.onNewDeck();
        this.centerHand.push(this.onDraw());
        this.players.forEach(player => player.setHand(this.onNewHand()));
        this.update();
    }

    public onMove(player: Player, move: IMove) {
        if(this.phase == 'started') {
            let { from, to } = move;

            let fromPlayer = this.players.findPlayerWith(from);
            let toPlayer = this.players.findPlayerWith(to);
            let toCenter = this.centerHand.hasCard(to);
            let fromCenter = this.centerHand.hasCard(from);
    
            if(this.currentPlayer == null) {
                this.setNextPlayer();
            }
    
            if (this.canSwap(player, fromPlayer, toPlayer)) {
                this.onSwap(player, from as Card, to as Card);
    
                this.update();
            } else if (toCenter && this.canPlace(player, fromPlayer, from as Card, to as Card)) {
                this.onPlace(fromPlayer, from);
    
                this.update();
            } else if(fromCenter && this.canPickup(player, toPlayer)) {
                this.onPickup(toPlayer, to);
                
                this.update();
            }
        }
    }

    public canPass(player: Player) {
        return player.equals(this.currentPlayer);
    }

    public onPass(player: Player) {
        this.setNextPlayer();
    }

    public canSwap(player: Player, fromPlayer: Player, toPlayer: Player) {
        return fromPlayer != null && toPlayer != null && fromPlayer.equals(toPlayer) && player.equals(fromPlayer);
    }

    public onSwap(player: Player, cardFrom: Card, cardTo: Card) {
        player.getHand().popInsert(cardFrom, cardTo);
    }

    public canPlace(player: Player, fromPlayer: Player, cardFrom: Card, cardTo: Card) {
        return fromPlayer && player.equals(fromPlayer) && player.equals(this.currentPlayer);
    }

    public onPlace(player: Player, cardFrom: ICard) {
        let card = player.getHand().remove(cardFrom);
        this.centerHand.push(card);
        player.draw(this.onDraw());
        this.setNextPlayer();
    }

    public canPickup(player: Player, toPlayer: Player) {
        return player.equals(toPlayer) && player.equals(this.currentPlayer);
    }

    public onPickup(player: Player, cardTo: ICard) {}

    public update() {
        if(this.checkGameComplete()) {
            this.phase = 'end';
        }

        this.players.forEach(player => this.updatePlayer(player));
    }

    public updatePlayer(player: Player) {
        this.players.update(player, this.getGameState(player));
    }

    public onPlayerJoin(player: Player) {
        if(player) {
            this.players.add(player);
    
            if(this.phase != 'waiting' || this.getMaxPlayers() < this.players.getCount()) {
                player.isViewer = true;
            } else if (this.currentPlayer === null) {
                this.setNextPlayer(player);
            }
        }
    }

    public onPlayerLeave(player: Player) {
        if(player) {
            this.players.remove(player);

            player.isViewer = false;

            if (this.currentPlayer == null) {
                this.setNextPlayer(player);
            } else if (player.equals(this.currentPlayer)) {
                if (this.getPlayerCount() > 1) {
                    this.setNextPlayer();
                } else {
                    this.setNextPlayer(undefined);
                }
            }
        }
    }

    public onNewDeck() {
        let deck = new CardCollection();

        for (let value of ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']) {
            for (let suit of ['♣', '♠', '♥', '♦']) {
                deck.push(new Card([value, suit]));
            }
        }

        deck.shuffle();

        this.deck = deck;
    }

    public onNewHand(): CardCollection {
        let deck = new CardCollection();

        for (let i = 0; i < this.getDrawSize(); i++) {
            deck.push(this.onDraw());
        }

        return deck;
    }

    public onDraw(): Card {
        if (this.deck.isEmpty()) {
            this.onNewDeck();
        }

        return this.deck.pop();
    }

    public getGameState(player: Player): IGameState {
        return {
            phase: this.phase,
            players: this.players.serialize(player),
            centerHand: this.centerHand.serialize(false),
            currentPlayer: (this.currentPlayer) ? this.currentPlayer.serialize(false) : null
        }
    }

    public getPlayers() {
        return this.players;
    }

    public getCurrentPlayer(): Player {
        return this.currentPlayer;
    }

    public getPlayerCount(): number {
        return this.players.getCount();
    }

    public setNextPlayer(player: Player=null, shift: number=1) {
        if (player == null) {
            this.currentPlayer = this.players.after(this.currentPlayer, shift);
        } else {
            this.currentPlayer = player;
        }
    }
}