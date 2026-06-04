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
const murmurhash = require("murmurhash");
/**
 * Creates new LSH HashTable
 */
class HashTable {
    constructor(numberOfHashes, hashFamily) {
        this.hashFamily = hashFamily;
        this.table = new Map();
        this.hashFunctions = new Array();
        for (let i = 0; i < numberOfHashes; i++) {
            this.hashFunctions.push(hashFamily.createHashFunction());
        }
    }
    query(vector) {
        const result = this.table.get(this.hash(vector));
        return result ? [...result] : [];
    }
    add(entity, vector) {
        const hash = this.hash(vector);
        if (!this.table.has(hash)) {
            this.table.set(hash, new Set());
        }
        this.table.get(hash).add(entity);
    }
    remove(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
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
        });
    }
    hash(vector) {
        const hashes = new Array();
        for (const hashFunction of this.hashFunctions) {
            hashes.push(hashFunction.hash(vector));
        }
        return this.combine(hashes);
    }
    combine(hashes) {
        let combined = "";
        for (let i = 0, j = hashes.length; i < j; i++) {
            const hash = hashes[i].toString();
            combined = combined.concat(hash.length + "" + hash);
        }
        return Number.parseInt(murmurhash.v3(combined));
    }
}
exports.default = HashTable;
