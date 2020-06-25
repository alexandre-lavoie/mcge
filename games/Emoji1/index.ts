import Game from "../../express_api/components/Game";
import CardCollection from "../../express_api/components/CardCollection";
import Card from "../../express_api/components/Card";
import Player from "../../express_api/components/Player";
import CardHolder from "../../express_api/components/CardHolder";
import TableHand from "../../express_api/components/TableHand";
import { IResponse } from 'mcge';

export default class Emoji1 extends Game {

    private direction: boolean;
    //private static readonly COLORS = ['🟩', '🟥', '🟦', '🟨'];
    private static readonly COLORS = ['G', 'R', 'B', 'Y'];
    //private static readonly BLACK = '⬛';
    private static readonly BLACK = '-';

    constructor() {
        super();

        this.direction = false;
    }

    public getButtons(): string[] {
        return ['pass'];
    }

    public getThemePath(): string {
        return __dirname + '/theme.json';
    }

    public getHidesOtherPlayerCards(): boolean {
        return true;
    }

    public getMaxPlayers(): number {
        return 4;
    }

    public getMinPlayers(): number {
        return 2;
    }

    public getDrawSize(): number {
        return 5;
    }

    public start() {
        this.onNewDeck();

        let nextCard = this.onDraw();

        while (nextCard && nextCard.value[1] == Emoji1.BLACK) {
            this.deck.pushFront(nextCard);

            nextCard = this.onDraw();
        }

        if(nextCard) {
            this.tableHand.push(nextCard);
        }
        
        this.players.forEach(player => player.setHand(this.onNewHand()));
    }

    public getGameComplete(): boolean {
        return this.phase == 'started' && this.players.toArray().findIndex(player => player.getHand().getCount() == 0 && !player.isViewer) >= 0;
    }

    public getDeck(): CardCollection {
        let deck = new CardCollection();

        for (let i = 0; i < 2; i++) {
            for (let value of [...[...Array(10 - i).keys()].map(k => k + i), '⛔', '2️⃣', '🔃']) {
                for (let suit of Emoji1.COLORS) {
                    deck.push(new Card([value.toString(), suit]));
                }
            }
        }

        for (let i = 0; i < 4; i++) {
            deck.push(new Card(['4️⃣', Emoji1.BLACK]));
            deck.push(new Card(['🌈', Emoji1.BLACK]));
        }

        return deck;
    }

    public onPromptResponse(response: IResponse) {
        let card = this.tableHand.peek();

        switch (response.id) {
            case 'changeColor4':
                card.value[1] = response.option;
                this.setNextPlayer(null, 2);
                break;
            case 'changeColor':
                card.value[1] = response.option;
                this.setNextPlayer();
                break;
            default:
                return;
        }

        this.update();
    }

    public canClickButton(player: Player, button: string) {
        switch (button) {
            case 'pass':
                return player.equals(this.currentPlayer);
        }
    }

    public onButtonClick(player: Player, button: string) {
        switch (button) {
            case 'pass':
                player.draw(this.onDraw());
                this.setNextPlayer();
                return true;
            default:
                return false;
        }
    }

    public onAction(player: Player, from: CardHolder, to: CardHolder, cardFrom: Card, cardTo: Card): boolean {
        if (this.performSwap(player, from, to, cardFrom, cardTo)) {
            return true;
        }

        // If current player is playing on table.
        if (to instanceof TableHand && player.equals(from) && this.isCurrentPlayer(player)) {
            // If either the value or the suit of the places card equals to the placed card.
            if (cardFrom.value[0] == cardTo.value[0] || cardFrom.value[1] == cardTo.value[1] || cardFrom.value[1] == Emoji1.BLACK) {
                let card = player.getHand().remove(cardFrom) as Card;
                this.tableHand.push(card);
                this.tableHand.shift();

                switch (cardFrom.value[0]) {
                    case '4️⃣':
                        if (this.direction) {
                            this.players.before(this.currentPlayer).drawMany(new CardCollection([this.onDraw(), this.onDraw(), this.onDraw(), this.onDraw()]));
                        } else {
                            this.players.after(this.currentPlayer).drawMany(new CardCollection([this.onDraw(), this.onDraw(), this.onDraw(), this.onDraw()]));
                        }
                    case '🌈':
                        if(this.currentPlayer) {
                            this.currentPlayer.sendPrompt({
                                id: (cardFrom.value[0] == '4️⃣') ? 'changeColor4' : 'changeColor',
                                title: 'Change Color',
                                content: 'Pick a color from the list below.',
                                options: Emoji1.COLORS
                            });
                        } else {
                            return false;
                        }

                        break;
                    case '2️⃣':
                        if (this.direction) {
                            this.players.before(this.currentPlayer).drawMany(new CardCollection([this.onDraw(), this.onDraw()]));
                        } else {
                            this.players.after(this.currentPlayer).drawMany(new CardCollection([this.onDraw(), this.onDraw()]));
                        }

                        this.setNextPlayer(null, 2);
                        break;
                    case '⛔':
                        this.setNextPlayer(null, 2);
                        break;
                    case '🔃':
                        this.direction = !this.direction;

                        if (this.players.getCount() <= 2) {
                            this.setNextPlayer(null, 2);
                        } else {
                            this.setNextPlayer();
                        }

                        break;
                    default:
                        this.setNextPlayer();
                }
            }

            return true;
        }

        return false;
    }

    public setNextPlayer(player: (Player | null) = null, shift: number = 1) {
        if (player == null) {
            if(this.currentPlayer) {
                if (this.direction) {
                    this.currentPlayer = this.players.before(this.currentPlayer, shift);
                } else {
                    this.currentPlayer = this.players.after(this.currentPlayer, shift);
                }
            } else {
                this.currentPlayer = this.players.toArray()[0];
            }
        } else {
            this.currentPlayer = player;
        }
    }
}