import Vector from "../../common/Vector";
import HashFamily from "./HashFamily";
import HashTable from "./HashTable";
import flatten = require("arr-flatten");

export default class LSH<T> {

    private hashFamily: HashFamily;
    private numberOfHashes: number;
    private numberOfHashTables: number;
    private hashTables: Array<HashTable<T>>;

    constructor(hashFamily: HashFamily, numberOfHashes: number, numberOfHashTables: number) {
        this.hashFamily = hashFamily;
        this.hashTables = new Array<HashTable<T>>();
        for (let i = 0; i < numberOfHashTables; i++) {
            this.hashTables.push(new HashTable<T>(numberOfHashes, this.hashFamily));
        }
    }

    public index(entity: T, vector: Vector): void {
        for (const table of this.hashTables){
            table.add(entity, vector);
        }
    }

    public async query(vector: Vector): Promise<T[]> {
        return new Promise<T[]>((res, rej) => {
            const candidates: T[][] = [];
            const tables = this.hashTables.entries();
            const loop = () => {
                const next = tables.next();
                if (next.done) {
                    res([...new Set(flatten(candidates) as T[])]);
                    return;
                }
                candidates.push(next.value[1].query(vector));
                setImmediate(loop);
            };
            setImmediate(loop);
        });
    }

    public remove(entity: T): void {
        for (let i = 0, j = this.hashTables.length; i < j; i++) {
            this.hashTables[i].remove(entity);
        }
    }
}
