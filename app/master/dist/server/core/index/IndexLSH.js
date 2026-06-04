"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DAOFactory_1 = require("../db-access/DAOFactory");
const Chi2HashFamily_1 = require("./lsh/families/Chi2HashFamily");
const EuclideanHashFamily_1 = require("./lsh/families/EuclideanHashFamily");
const S2JSDHashFamily_1 = require("./lsh/families/S2JSDHashFamily");
const LSH_1 = require("./lsh/LSH");
const Debug = require("debug");
const debug = Debug("IndexLSH");
class IndexLSH {
    constructor(config) {
        this.lshEnabled = config.lshEnabled === true;
        this.dao = DAOFactory_1.DAOFactory.getImagesDAO();
        this.exclude = ["originId", "autotags", "license", "node"];
        this.data = new Map();
        this.max = typeof config.max === "number" ? config.max : 10000;
        if (this.lshEnabled) {
            const k = typeof config.k === "number" ? config.k : 4;
            const delta = typeof config.delta === "number" ? config.delta : 0.1;
            const w = typeof config.w === "number" ? config.w : 0.4;
            const p = typeof config.p === "number" ? config.p : 0.5;
            const dimensions = typeof config.dimensions === "number" ? config.dimensions : 0;
            const L = config.L && typeof config.L === "number" ? config.L :
                Math.ceil(Math.log(1 / delta) / -Math.log(1 - Math.pow(p, k)));
            debug(`L: ${L}, w: ${w}, k: ${k}`);
            const family = typeof config.family === "string" ? config.family.toLowerCase() : "euclidean";
            switch (config.family) {
                case "chi2":
                    this.lsh = new LSH_1.default(new Chi2HashFamily_1.default(dimensions, w), k, L);
                    break;
                case "s2jsd":
                    this.lsh = new LSH_1.default(new S2JSDHashFamily_1.default(dimensions, w), k, L);
                    break;
                default:
                    this.lsh = new LSH_1.default(new EuclideanHashFamily_1.default(dimensions, w), k, L);
                    break;
            }
        }
    }
    /** Add one descriptor to the index
    * @param descriptor Image descriptor
    */
    index(descriptor) {
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
    indexMany(descriptors) {
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
    query(comparator, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            debug("query started...");
            if (this.lshEnabled) {
                const descriptor = comparator.getRequestDescriptor();
                const result = [];
                const candidates = yield this.lsh.query(descriptor.histogram);
                debug(`candidates: ${candidates.length}`);
                return new Promise((res, rej) => {
                    let i = candidates.length;
                    const loop = () => {
                        let iterations = 1000;
                        while (iterations--) {
                            if (i-- >= 0 && result.length < limit) {
                                const candidate = this.data.get(candidates[i]);
                                if (candidate) {
                                    comparator.compare(candidate, result);
                                }
                            }
                            else {
                                res(result);
                                return;
                            }
                        }
                        setImmediate(loop);
                    };
                    setImmediate(loop);
                });
            }
            else {
                return this.linearQuery(comparator, limit);
            }
        });
    }
    /** Query linear
    * @param comparator Comparator
    * @param limit Max. number of results
    * @return Promise for result set of ResultDTO objects
    */
    linearQuery(comparator, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
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
                        }
                        else {
                            res(result);
                            return;
                        }
                    }
                    setImmediate(loop);
                };
                setImmediate(loop);
            });
        });
    }
    /** Removes descriptor from index
    * @param i ImageDescriptor or id
    */
    remove(i) {
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
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            debug("build index...");
            yield this.dao.iterateNode((descriptor) => {
                this.index(descriptor);
            }, this.max);
            debug(`indexed: ${this.data.size} elements...`);
        });
    }
    count() {
        return this.data.size;
    }
}
exports.default = IndexLSH;
