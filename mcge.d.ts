declare module 'mcge' {
    export interface ICard {
        id: string,
        value: string[]
    }
    
    export interface IPlayer {
        id: string,
        name: string,
        hand: ICard[]
    }
    
    export interface IGameState {
        phase: 'waiting' | 'started' | 'end',
        players: IPlayer[],
        centerHand: ICard[],
        currentPlayer: IPlayer | null
    }
    
    export interface IPrompt {
        id: string
        title: string
        content: string
        options: string[]
    }
    
    export interface IResponse {
        id: string
        option: string
    }
    
    export interface IMove {
        from: ICard,
        to: ICard
    }

    export class Game {
        protected players: PlayerCollection;
        protected deck: CardCollection;
        protected tableHand: TableHand;
        protected currentPlayer: Player | null;
        public phase: 'waiting' | 'started' | 'end';

        public abstract start(): void;
        public update(): void;
        public updatePlayer(player: Player): void;
        public isCurrentPlayer(player: Player): boolean;
        protected performSwap(player: Player, from: CardHolder, to: CardHolder, cardFrom: Card, cardTo: Card): boolean;
        public setNextPlayer(player: (Player | null) = null, shift: number = 1): void;

        public getName(): string;
        public abstract getMinPlayers(): number;
        public abstract getMaxPlayers(): number;
        public abstract getHidesOtherPlayerCards(): boolean;
        public abstract getDrawSize(): number;
        public abstract getGameComplete(): boolean;
        public abstract getThemePath(): string;
        public abstract getButtons(): string[];
        public abstract getDeck(): CardCollection;
        public getPlayers(): Player;
        public getTheme(): object;
        public getCurrentPlayer(): Player | null;
        public getPlayerCount(): number;
        public getGameState(player: Player): IGameState;

        public abstract onPromptResponse(response: IResponse): void;
        public abstract onButtonClick(player: Player, button: string): boolean;
        public abstract onAction(player: Player, from: CardHolder, to: CardHolder, cardFrom: Card, cardTo: Card): boolean;
        public onPlayerJoin(player: Player): void;
        public onPlayerLeave(player: Player): void;
        public onPlayerMove(player: Player, move: IMove): void;
        public onNewDeck(): void;
        public onNewHand(): CardCollection;
        public onDraw(): Card;
    }

    export abstract class Collection<T> {
        protected collection: T[];
        public abstract serialize(): object;
    
        constructor(collection?: T[]);

        public isEmpty(): void;
        public getCount(): number;
        public toArray(): T[];
        public replace(collection: Collection<T>);
        public swap(v1: T, v2: T);
        public shuffle();
        public add(e: T, index?: number);
        public push(e: T);
        public pushFront(e: T);
        public popInsert(v1: T, v2: T);
        public pushWithOffset(index: number, element: T);
        public pushToOffsetElement(offset: T, element: T);
        public append(collection: Collection<T>);
        public pop(): T | undefined;
        public peek(): T | undefined;
        public shift(): T | undefined;
        public find(e: any): T | undefined;
        public elementEquals(v1: T, v2: T): boolean;
        public findIndex(e: T): number;
        public filter(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
        public forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): T[];
        public after(e: T, shift: number=1): T | null;
        public before(e: T, shift: number=1): T | null;
        public remove(e: any): T | null;
    }

    export class CardCollection extends Collection<Card> {
        public elementEquals(v1: Card | ICard, v2: Card | ICard): boolean;
        public hasCard(card: Card | ICard): boolean;
        public draw(): Card | undefined;
        public serialize(hidden: boolean = false): ICard[];
    }

    export class PlayerCollection extends Collection<Player> {
        private hidesPlayerCards: boolean;
    
        constructor(players: Player[] = [], hidesPlayerCards: boolean = true);

        public findPlayerWith(card: Card | ICard): Player | undefined;
        public update(player: Player, gameState: IGameState);
        public serialize(player?: Player): IPlayer[];
        public after(player: (Player | null), shift: number=1): Player;
        public before(player: (Player | null), shift: number=1): Player;
    }

    export interface CardHolder {
        getCards(): CardCollection
    }

    export class Card {
        public id: string;
        public value: string[];
    
        constructor(value: string[]=[], id?: string);
    
        public serialize(hidden: boolean = false): ICard;
        public static empty(): Card;
        public isEmpty(): boolean;
    }

    export default class Player implements CardHolder {

        public id: string;
        public socket: SocketIO.Socket;
        private hand: CardCollection;
        private room: Room | null;
        public name: string;
        public isViewer: boolean;
    
        constructor(socket: SocketIO.Socket);
    
        public getCards(): CardCollection;
        public sendPrompt(prompt: IPrompt): void;
        public joinRoom(room: Room): void;
        public leaveRoom(): void;
        public draw(card: Card): void;
        public drawMany(hand: CardCollection): void;
        public hasCard(card: Card | ICard): boolean;
        public getRoom(): Room;
        public setHand(cards: CardCollection): void;
        public serialize(hidden: boolean = false): IPlayer;
        public getHand(): CardCollection;
        public equals(obj: any): boolean;
    }
}