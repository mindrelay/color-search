export default class CircularList<T>{

    private elements: T[];
    private currentIndex: number;

    constructor() {
        this.elements = new Array<T>();
        this.currentIndex = 0;
    }

    public size(): number {
        return this.elements.length;
    }

    public clear(): void {
        this.elements = new Array<T>();
        this.currentIndex = 0;
    }

    public currentElement(): T {
        if (this.elements.length > 0) {
            return this.elements[this.currentIndex];
        }
        return null;
    }

    public indexOf(element: T): number {
        return this.elements.indexOf(element);
    }

    public add(element: T) {
        this.elements.push(element);
    }

    public remove(index: number): void {
        if (index < this.elements.length) {
            this.elements.splice(index, 1);
        }
    }

    public getElement(index: number): T {
        if (index < this.elements.length) {
            return this.elements[index];
        }
        return null;
    }

    public has(element: T): boolean {
        return this.elements.includes(element);
    }

    public next(): T {
        if (this.elements.length > 0) {
            this.currentIndex = (this.currentIndex + 1) < this.elements.length ? (this.currentIndex + 1) : 0;
            return this.elements[this.currentIndex];
        }
        return null;
    }

    public prev(): T {
        if (this.elements.length > 0) {
            this.currentIndex = (this.currentIndex - 1) > 0 ? (this.currentIndex - 1) : this.elements.length - 1;
            return this.elements[this.currentIndex];
        }
        return null;
    }

    public getCurrentIndex(): number {
        return this.currentIndex;
    }

    public setCurrentIndex(index: number): void {
        if (index >= 0 && index < this.elements.length) {
            this.currentIndex = index;
        }
    }
}
