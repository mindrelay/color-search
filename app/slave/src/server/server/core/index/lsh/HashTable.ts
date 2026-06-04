import Vector from "../../common/Vector";
import HashFamily from "./HashFamily";
import HashFunction from "./HashFunction";
import murmurhash = require("murmurhash");

/**
 * Creates new LSH HashTable
 */
export default class HashTable<T> {

    private hashFamily: HashFamily;
    private table: Map<number, Set<T>>;
    private hashFunctions: HashFunction[];

    constructor(numberOfHashes: number, hashFamily: HashFamily) {
        this.hashFamily = hashFamily;
        this.table = new Map<number, Set<T>>();
        this.hashFunctions = new Array<HashFunction>();
        for (let i = 0; i < numberOfHashes; i++) {
            this.hashFunctions.push(hashFamily.createHashFunction());
        }
    }

    public query(vector: Vector): T[] {
        const result = this.table.get(this.hash(vector));
        return result ? [...result] : [];
    }

    public add(entity: T, vector: Vector): void {
        const hash = this.hash(vector);
        if (!this.table.has(hash)) {
            this.table.set(hash, new Set<T>());
        }
        this.table.get(hash).add(entity);
    }

    public async remove(entity: T): Promise<void> {
        return new Promise<void>((res, rej) => {
            const entries = this.table.entries();
            const loop = () => {
                const next = entries.next();
                if (next.done) {
                    res();
                    return;
                }
                next.value[1].delete(entity);
                setImmediate(() => {
                    loop();
                });
            };
            loop();
        });
    }

    private hash(vector: Vector): number {
        const hashes = new Array<number>();
        for (const hashFunction of this.hashFunctions){
            hashes.push(hashFunction.hash(vector));
        }
        return this.combine(hashes);
    }

    private combine(hashes: number[]): number {
        let combined = "";
        for (let i = 0, j = hashes.length; i < j; i++) {
             const hash = hashes[i].toString();
             combined = combined.concat(hash.length + "" + hash);
        }
        return Number.parseInt(murmurhash.v3(combined));
    }
}
