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