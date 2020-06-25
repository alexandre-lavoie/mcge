export default abstract class Collection<T> {

    protected collection: T[];
    public abstract serialize(): object;

    constructor(collection?: T[]) {
        if(collection) {
            this.collection = collection;
        } else {
            this.collection = [];
        }
    }

    public isEmpty() {
        return this.collection.length == 0;
    }

    public getCount() {
        return this.collection.length;
    }

    public toArray() {
        return this.collection;
    }

    public replace(collection: Collection<T>) {
        this.collection = collection.toArray();
    }

    public swap(v1: T, v2: T) {
        let i1 = this.findIndex(v1);
        let temp = this.collection[i1];
        let i2 = this.findIndex(v2);

        if(i1 == -1 || i2 == -1) {
            throw 'Could not find cards to swap.';
        }

        this.collection[i1] = this.collection[i2];
        this.collection[i2] = temp;
    }

    public shuffle() {
        this.collection.sort(() => Math.random() - 0.5);
    }

    public add(e: T, index?: number) {
        if(index) {
            this.collection.splice(index, 0, e);
        } else {
            this.push(e);
        }
    }

    public push(e: T) {
        this.collection.push(e);
    }

    public pushFront(e: T) {
        this.collection == [e, ...this.collection];
    }

    public popInsert(v1: T, v2: T) {
        let i = this.findIndex(v1);
        let j = this.findIndex(v2);

        if(i > -1 && j > -1) {
            let temp = this.remove(v1);

            if(temp) {
                this.collection.splice(j + ((i > j) ? 0 : 1), 0, temp); 
            }
        }
    }

    public pushWithOffset(index: number, element: T) {
        this.collection.splice(index, 0, element);
    }

    public pushToOffsetElement(offset: T, element: T) {
        let i = this.findIndex(offset);

        if(i == -1) {
            throw 'Could not find cards to push with offset.';
        }

        this.pushWithOffset(i, element);
    }

    public append(collection: Collection<T>) {
        collection.toArray().forEach(e => this.push(e));
    }

    public pop() {
        return this.collection.pop();
    }

    public peek() {
        return this.collection[this.collection.length - 1];
    }

    public shift() {
        return this.collection.shift();
    }

    public find(e: any): T | undefined {
        return this.collection.find(c => this.elementEquals(e, c));
    }

    public elementEquals(v1: T, v2: T) {
        return v1 == v2;
    }

    public findIndex(e: T): number {
        return this.collection.findIndex(c => this.elementEquals(e, c));
    }

    public filter(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any) {
        return this.collection.filter(callbackfn, thisArg);
    }

    public forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any) {
        this.collection.forEach(callbackfn, thisArg);
    }

    public after(e: T, shift: number=1): T | null {
        let index = this.findIndex(e);

        if (index >= 0) {
            return this.collection[(index + shift) % this.collection.length];
        } else {
            return null;
        }
    }

    public before(e: T, shift: number=1): T | null {
        let index = this.findIndex(e);

        if (index >= 0) {
            let offset = index - shift;

            if(offset < 0) {
                offset = this.collection.length - ((offset * -1) % this.collection.length);
            }

            return this.collection[offset];
        } else {
            return null;
        }
    }

    public remove(e: any): T | null {
        let index = this.findIndex(e);

        if(index >= 0) {
            return this.collection.splice(index, 1)[0];
        }

        return null;
    }
}