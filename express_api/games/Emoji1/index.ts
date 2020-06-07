import Game from "../../components/Game";
import CardCollection from "../../components/CardCollection";
import Card from "../../components/Card";
import Player from "../../components/Player";
import { ICard, IResponse } from "../../../components/Interface";

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

    public getName(): string {
        return "Emoji1";
    }

    public start() {
        this.phase = 'started';
        this.onNewDeck();
        
        let nextCard = this.onDraw();

        while (nextCard.value[1] == Emoji1.BLACK) {
            this.deck.pushFront(nextCard);

            nextCard = this.onDraw();
        }

        this.centerHand.push(nextCard);
        this.players.forEach(player => player.setHand(this.onNewHand()));
        this.update();
    }

    public checkGameComplete(): boolean {
        return this.phase == 'started' && this.players.toArray().findIndex(player => player.getHand().getCount() == 0 && !player.isViewer) >= 0;
    }

    public onNewDeck() {
        let deck = new CardCollection();

        for(let i = 0; i < 2; i++) {
            for (let value of [...[...Array(10 - i).keys()].map(k => k + i), '⛔', '2️⃣', '🔃']) {
                for (let suit of Emoji1.COLORS) {
                    deck.push(new Card([value.toString(), suit]));
                }
            }
        }

        for(let i=0; i < 4; i++) {
            deck.push(new Card(['4️⃣', Emoji1.BLACK]));
            deck.push(new Card(['🌈', Emoji1.BLACK]));
        }

        deck.shuffle();

        this.deck = deck;
    }

    public onPromptResponse(response: IResponse) {
        let card = this.centerHand.peek();

        switch(response.id) {
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

    public onPass(player: Player) {
        player.draw(this.onDraw());
        this.setNextPlayer();
        this.update();
    }

    public canPickup() {
        return false;
    }

    public canPlace(player: Player, fromPlayer: Player, cardFrom: Card, cardTo: Card) {
        return super.canPlace(player, fromPlayer, cardFrom, cardTo) && (cardFrom.value[0] == cardTo.value[0] || cardFrom.value[1] == cardTo.value[1] || cardFrom.value[1] == Emoji1.BLACK);
    }

    public onPlace(player: Player, cardFrom: ICard) {
        let card = player.getHand().remove(cardFrom);
        this.centerHand.push(card);
        this.centerHand.shift();

        switch(cardFrom.value[0]) {
            case '4️⃣':
                if(this.direction) {
                    this.players.before(this.currentPlayer).drawMany(new CardCollection([this.onDraw(), this.onDraw(), this.onDraw(), this.onDraw()]));
                } else {
                    this.players.after(this.currentPlayer).drawMany(new CardCollection([this.onDraw(), this.onDraw(), this.onDraw(), this.onDraw()]));
                }
            case '🌈':
                this.currentPlayer.sendPrompt({
                    id: (cardFrom.value[0] == '4️⃣') ? 'changeColor4' : 'changeColor',
                    title: 'Change Color',
                    content: 'Pick a color from the list below.',
                    options: Emoji1.COLORS
                });
                break;
            case '2️⃣':
                if(this.direction) {
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

                if(this.players.getCount() <= 2) {
                    this.setNextPlayer(null, 2);
                } else {
                    this.setNextPlayer();
                }

                break;
            default:
                this.setNextPlayer();
        }

        this.update();
    }

    public setNextPlayer(player: Player=null, shift: number=1) {
        if (player == null) {
            if(this.direction) {
                this.currentPlayer = this.players.before(this.currentPlayer, shift);
            } else {
                this.currentPlayer = this.players.after(this.currentPlayer, shift);
            }
        } else {
            this.currentPlayer = player;
        }
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
}