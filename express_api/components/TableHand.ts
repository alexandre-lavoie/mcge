import CardCollection from "./CardCollection"
import CardHolder from "./CardHolder";

export default class TableHand extends CardCollection implements CardHolder {
    public getCards(): CardCollection {
        return this;
    }
}