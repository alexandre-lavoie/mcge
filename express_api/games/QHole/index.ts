import Game from "../../components/Game";
import Player from "../../components/Player";
import { IResponse } from "../../../components/Interface";
import CardCollection from "../../components/CardCollection";
import Card from "../../components/Card";
import CardHolder from "../../components/CardHolder";
import TableHand from "../../components/TableHand";

export default class QHole extends Game {

    public static readonly JOKER = '🃏';
    public static readonly CARD_ORDER = ['3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A', '2', QHole.JOKER];
    private roundStartingPlayer: Player;
    private roundWinningPlayer: Player;
    
    constructor() {
        super();
        this.roundStartingPlayer = null;
        this.roundWinningPlayer = null;
    }

    public getMinPlayers(): number {
        return 2;
    }

    public getMaxPlayers(): number {
        return 4;
    }

    public getHidesOtherPlayerCards(): boolean {
        return true;
    }

    public getDrawSize(): number {
        return 52 / this.getPlayerCount();
    }

    public getGameComplete(): boolean {
        return this.phase == 'started' && this.players.toArray().every(player => player.getHand().getCount() == 0 || player.isViewer);
    }
    public onPromptResponse(response: IResponse) { }

    public getThemePath(): string {
        return __dirname + '/theme.json';
    }
    public getButtons(): string[] {
        return ['next'];
    }

    public start() {
        this.onNewDeck();
        this.players.forEach(player => player.setHand(this.onNewHand()));
        this.nextRound();
    }

    public onAction(player: Player, from: CardHolder, to: CardHolder, cardFrom: Card, cardTo: Card): boolean {
        if (this.performSwap(player, from, to, cardFrom, cardTo)) {
            return true;
        }

        // If we are swapping on the table.
        if (from instanceof TableHand && to instanceof TableHand && this.isCurrentPlayer(player)) {
            let emptyIndex = to.getCards().findIndex(Card.empty());

            if (to.getCards().findIndex(cardFrom) > emptyIndex && to.getCards().findIndex(cardTo) > emptyIndex) {
                to.getCards().popInsert(cardFrom, cardTo);

                return true;
            } else {
                return false;
            }
        }

        // If we are playing on table and we are current player.
        if (from instanceof Player && to instanceof TableHand && player.equals(from) && this.isCurrentPlayer(player)) {
            // Add card to table.
            let card = from.getCards().remove(cardFrom);
            to.getCards().pushWithOffset(Math.max(to.getCards().findIndex(cardTo), to.getCards().findIndex(Card.empty()) + 1), card);

            return true;
        }

        // If we are taking a card and we are current player (and the card is not empty).
        if (from instanceof TableHand && to instanceof Player && player.equals(to) && this.isCurrentPlayer(player)) {
            let emptyIndex = from.getCards().findIndex(Card.empty());

            if (from.getCards().findIndex(cardFrom) > emptyIndex) {
                // Remove card from table.
                let card = from.getCards().remove(cardFrom);
                to.getCards().pushToOffsetElement(cardTo, card);

                return true;
            }
        }

        return false;
    }

    public getDeck(): CardCollection {
        let deck = new CardCollection();

        for (let value of ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']) {
            for (let suit of ['♣', '♠', '♥', '♦']) {
                deck.push(new Card([value, suit]));
            }
        }

        deck.push(new Card([QHole.JOKER, 'R']));
        deck.push(new Card([QHole.JOKER, 'B']));

        return deck;
    }
    public canClickButton(player: Player, button: string): boolean {
        switch (button) {
            case 'next':
                return player.equals(this.currentPlayer);
        }
    }

    private nextRound() {
        this.tableHand = new TableHand();
        this.tableHand.push(Card.empty());

        if (this.roundWinningPlayer) {
            this.currentPlayer = this.roundWinningPlayer;
            this.roundStartingPlayer = this.roundWinningPlayer;
        } else {
            this.roundWinningPlayer = this.currentPlayer;
            this.roundStartingPlayer = this.currentPlayer;
        }
    }

    public onButtonClick(player: Player, button: string): boolean {
        switch (button) {
            case 'next':
                if (!this.isCurrentPlayer(player)) {
                    return false;
                }

                let emptyCardIndex = this.tableHand.findIndex(Card.empty());

                let cardSlice = this.tableHand.toArray().slice(emptyCardIndex + 1);

                let value = '-1';

                if (cardSlice.length > 0) {
                    value = cardSlice[0].value[0];

                    if (!cardSlice.every(card => card.value[0] == value)) {
                        return false;
                    }
                } else {
                    if (emptyCardIndex > 0) {
                        this.setNextPlayer();

                        if (this.currentPlayer.equals(this.roundStartingPlayer)) {
                            this.nextRound();
                        }

                        return true;
                    } else {
                        return false;
                    }
                }

                if (emptyCardIndex > 0 && 
                    QHole.CARD_ORDER.findIndex(v => v == value) < QHole.CARD_ORDER.findIndex(v => v == this.tableHand.toArray()[0].value[0]) &&
                    (value == QHole.JOKER || (value == '2' && cardSlice.length == emptyCardIndex - 1) || cardSlice.length == emptyCardIndex)
                ) {
                    return false;
                }

                for (let i = 0; i <= emptyCardIndex; i++) {
                    this.tableHand.shift();
                }

                this.roundWinningPlayer = player;

                this.tableHand.push(Card.empty());

                this.setNextPlayer();

                if (this.currentPlayer.equals(this.roundStartingPlayer)) {
                    this.nextRound();
                }

                return true;
            default:
                return false;
        }
    }
}