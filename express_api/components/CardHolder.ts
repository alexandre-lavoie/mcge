import CardCollection from "./CardCollection";

export default interface CardHolder {
    getCards(): CardCollection
}