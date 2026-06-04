import Vector from "../common/Vector";
import {DAOFactory, ImagesNodeDAO} from "../db-access/DAOFactory";
import {ImageDescriptor} from "../descriptors/Descriptors";
import ResultDTO from "../dto/ResultDTO";
import Chi2HashFamily from "./lsh/families/Chi2HashFamily";
import EuclideanHashFamily from "./lsh/families/EuclideanHashFamily";
import S2JSDHashFamily from "./lsh/families/S2JSDHashFamily";
import HashFamily from "./lsh/HashFamily";
import LSH from "./lsh/LSH";
import Debug = require("debug");
import Comparator from "../image-finder/Comparator";
import {Index} from "./Index";
const debug = Debug("IndexLSH");

export default class IndexLSH implements Index {

    private lsh: LSH<number>;
    private data: Map<number, ImageDescriptor>;
    private dao: ImagesNodeDAO;
    private exclude: string[];
    private lshEnabled: boolean;
    private max: number;

    constructor(config: {lshEnabled: boolean, max: number, p: number, k: number, delta: number, w: number,
                        dimensions: number, family: string, L?: number}) {
        this.lshEnabled = config.lshEnabled === true;
        this.dao = DAOFactory.getImagesNodeDAO();
        this.exclude = ["originId", "autotags", "license", "node"];
        this.data = new Map();
        this.max = typeof config.max === "number" ? config.max : 10000;
        if (this.lshEnabled) {
            const k: number = typeof config.k === "number" ? config.k : 4;
            const delta: number = typeof config.delta === "number" ? config.delta : 0.1;
            const w: number = typeof config.w === "number" ? config.w : 0.4;
            const p: number = typeof config.p === "number" ? config.p : 0.5;
            const dimensions: number = typeof config.dimensions === "number" ? config.dimensions : 0;
            const L: number = config.L && typeof config.L === "number" ?  config.L :
            Math.ceil(Math.log(1 / delta) / - Math.log(1 - Math.pow(p, k)));
            debug(`L: ${L}, w: ${w}, k: ${k}`);
            const family = typeof config.family === "string" ? config.family.toLowerCase() : "euclidean";
            switch (config.family) {
                case "chi2" : this.lsh = new LSH(new Chi2HashFamily(dimensions , w), k, L); break;
                case "s2jsd" : this.lsh = new LSH(new S2JSDHashFamily(dimensions , w), k, L); break;
                default: this.lsh = new LSH(new EuclideanHashFamily(dimensions , w), k, L); break;
            }
        }
    }

    /** Add one descriptor to the index
    * @param descriptor Image descriptor
    */
    public index(descriptor: ImageDescriptor): void {
        if (!this.data.has(descriptor.id)) {
            this.exclude.forEach((prop) => delete descriptor[prop]);
            this.data.set(descriptor.id, descriptor);
            if (this.lshEnabled) {
                this.lsh.index(descriptor.id, descriptor.histogram);
            }
        }
    }

    /** Add many descriptors to the index
    * @param descriptors Image descriptors
    */
    public indexMany(descriptors: ImageDescriptor[]): void {
        if (descriptors && descriptors.length > 0) {
            debug("index many...");
            for (let i = 0, j = descriptors.length; i < j; i++) {
                this.index(descriptors[i]);
            }
        }
    }

    /** Query with LSH
    * @param comparator Comparator
    * @param limit Max. number of results
    * @return Promise for result set of ResultDTO objects
    */
    public async query(comparator: Comparator, limit: number): Promise<ResultDTO[]> {
        debug("query started...");
        if (this.lshEnabled) {
            const descriptor = comparator.getRequestDescriptor();
            const result: ResultDTO[] = [];
            const candidates = await this.lsh.query(descriptor.histogram);
            debug(`candidates: ${candidates.length}`);
            return new Promise<ResultDTO[]>((res, rej) => {
                let i = candidates.length;
                const loop = () => {
                    let iterations = 1000;
                    while (iterations--) {
                        if (i-- >= 0 && result.length < limit) {
                            const candidate = this.data.get(candidates[i]);
                            if (candidate) {
                                comparator.compare(candidate, result);
                            }
                        } else {
                            res(result);
                            return;
                        }
                    }
                    setImmediate(loop);
                };
                setImmediate(loop);
            });
        } else {
            return this.linearQuery(comparator, limit);
        }
    }

    /** Query linear
    * @param comparator Comparator
    * @param limit Max. number of results
    * @return Promise for result set of ResultDTO objects
    */
    public async linearQuery(comparator: Comparator, limit: number): Promise<ResultDTO[]> {
        return new Promise<ResultDTO[]>((res, rej) => {
            const result = [];
            const values = this.data.values();
            const loop = () => {
                let iterations = 1000;
                while (iterations--) {
                    const next = values.next();
                    if (!next.done && result.length < limit) {
                        const candidate = values.next().value;
                        if (candidate) {
                            comparator.compare(candidate, result);
                        }
                    } else {
                        res(result);
                        return;
                    }
                }
                setImmediate(loop);
            };
            setImmediate(loop);
        });
    }

    /** Removes descriptor from index
    * @param i ImageDescriptor or id
    */
    public remove(i: ImageDescriptor | number): void {
        const id = typeof i === "number" ? i : i.id;
        if (this.data.has(id)) {
            this.data.delete(id);
            if (this.lshEnabled) {
                this.lsh.remove(id);
            }
        }
    }

    /** Load descriptors into index from Database
    */
    public async load(): Promise<void> {
        debug("build index...");
        await this.dao.iterateNode((descriptor) => {
            this.index(descriptor);
        }, this.max);
        debug(`indexed: ${this.data.size} elements...`);
    }

    public count(): number {
        return this.data.size;
    }
}
