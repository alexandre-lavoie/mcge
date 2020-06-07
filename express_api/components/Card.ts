import { ICard } from '../../components/Interface';

export default class Card {
    public id: string;
    public value: string[];

    constructor(value: string[]=[]) {
        this.id = '' + Math.random().toString(36).substr(2, 9);
        this.value = value;
    }

    public serialize(hidden: boolean = false): ICard {
        return {id: this.id, value: (hidden) ? [] : this.value};
    }
}