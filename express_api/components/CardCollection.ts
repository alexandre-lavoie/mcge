import Card from "./Card";
import { ICard } from "../../components/Interface";
import Collection from "./Collection";

export default class CardCollection extends Collection<Card> {
    public elementEquals(v1: Card | ICard, v2: Card | ICard) {
        return v1.id == v2.id;
    }

    public hasCard(card: Card | ICard) {
        return this.findIndex(card as Card) >= 0;
    }

    public draw(): Card {
        return this.pop();
    }

    public serialize(hidden: boolean = false): ICard[] {
        return this.collection.map(card => (card) ? card.serialize(hidden) : {id: '-1', value: []});
    }
}