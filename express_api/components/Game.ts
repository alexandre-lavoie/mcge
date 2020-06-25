import Player from "./Player";
import Card from "./Card";
import { IGameState, IMove, IResponse } from 'mcge';
import CardCollection from "./CardCollection";
import PlayerCollection from "./PlayerCollection";
import TableHand from "./TableHand";
import CardHolder from "./CardHolder";

export default abstract class Game {

    protected players: PlayerCollection;
    protected deck: CardCollection;
    protected tableHand: TableHand;
    protected currentPlayer: Player | null;
    public phase: 'waiting' | 'started' | 'end';
    public abstract start(): void;
    public abstract getMinPlayers(): number;
    public abstract getMaxPlayers(): number;
    public abstract getHidesOtherPlayerCards(): boolean;
    public abstract getDrawSize(): number;
    public abstract getGameComplete(): boolean;
    public abstract onPromptResponse(response: IResponse): void;
    public abstract getThemePath(): string;
    public abstract getButtons(): string[];
    public abstract getDeck(): CardCollection;
    public abstract onButtonClick(player: Player, button: string): boolean;
    public abstract onAction(player: Player, from: CardHolder, to: CardHolder, cardFrom: Card, cardTo: Card): boolean;

    constructor() {
        this.players = new PlayerCollection([], this.getHidesOtherPlayerCards());
        this.currentPlayer = null;
        this.phase = 'waiting';
        this.deck = new CardCollection();
        this.tableHand = new TableHand();
    }

    public onPlayerMove(player: Player, move: IMove) {
        if (this.phase == 'started') {
            if (this.currentPlayer == null) {
                this.setNextPlayer();
            }

            let { from, to } = move;

            let fromCardHolder: CardHolder | undefined = this.players.findPlayerWith(from);
            let toCardHolder: CardHolder | undefined = this.players.findPlayerWith(to);

            if (this.tableHand.hasCard(from)) {
                fromCardHolder = this.tableHand;
            }

            if (this.tableHand.hasCard(to)) {
                toCardHolder = this.tableHand;
            }

            if(fromCardHolder && toCardHolder) {
                let fromCard = fromCardHolder.getCards().find(from);
                let toCard = toCardHolder.getCards().find(to);
    
                if(fromCard && toCard) { 
                    if (this.onAction(player, fromCardHolder, toCardHolder, fromCard, toCard)) {
                        this.update();
                    }
                }
            }
        }
    }

    public getName(): string {
        return Object.getPrototypeOf(this).constructor.name;
    };

    public update() {
        if (this.getGameComplete()) {
            this.phase = 'end';
        }

        this.players.forEach(player => this.updatePlayer(player));
    }

    public updatePlayer(player: Player) {
        this.players.update(player, this.getGameState(player));
    }

    public onPlayerJoin(player: Player) {
        if (player) {
            this.players.add(player);

            if (this.phase != 'waiting' || this.getMaxPlayers() < this.players.getCount()) {
                player.isViewer = true;
            } else if (this.currentPlayer === null) {
                this.setNextPlayer(player);
            }
        }
    }

    public onPlayerLeave(player: Player) {
        if (player) {
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

    public isCurrentPlayer(player: Player) {
        return player.equals(this.currentPlayer);
    }

    protected performSwap(player: Player, from: CardHolder, to: CardHolder, cardFrom: Card, cardTo: Card): boolean {
        if(from instanceof Player && to instanceof Player && player.equals(from) && player.equals(to)) {
            from.getCards().popInsert(cardFrom, cardTo);

            return true;
        }

        return false;
    }

    public onNewDeck() {
        let deck = this.getDeck();

        deck.shuffle();

        this.deck = deck;
    }

    public onNewHand(): CardCollection {
        let deck = new CardCollection();

        for (let i = 0; i < this.getDrawSize(); i++) {
            let nextCard = this.onDraw();

            if(nextCard) {
                deck.push(nextCard);
            }
        }

        return deck;
    }

    public onDraw(): Card {
        if (this.deck.isEmpty()) {
            this.onNewDeck();
        }
        
        return this.deck.pop() as Card;
    }

    public getGameState(player: Player): IGameState {
        return {
            phase: this.phase,
            players: this.players.serialize(player),
            centerHand: this.tableHand.serialize(false),
            currentPlayer: (this.currentPlayer) ? this.currentPlayer.serialize(false) : null
        }
    }

    public getPlayers() {
        return this.players;
    }

    public getTheme(): object {
        return require(this.getThemePath());
    }

    public getCurrentPlayer(): Player | null {
        return this.currentPlayer;
    }

    public getPlayerCount(): number {
        return this.players.getCount();
    }

    public setNextPlayer(player: (Player | null) = null, shift: number = 1) {
        if (player == null) {
            if(this.currentPlayer == null) {
                this.currentPlayer = this.players.toArray()[0];
            } else {
                this.currentPlayer = this.players.after(this.currentPlayer, shift);
            }
        } else {
            this.currentPlayer = player;
        }
    }
}