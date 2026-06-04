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
const HashTable_1 = require("./HashTable");
const flatten = require("arr-flatten");
class LSH {
    constructor(hashFamily, numberOfHashes, numberOfHashTables) {
        this.hashFamily = hashFamily;
        this.hashTables = new Array();
        for (let i = 0; i < numberOfHashTables; i++) {
            this.hashTables.push(new HashTable_1.default(numberOfHashes, this.hashFamily));
        }
    }
    index(entity, vector) {
        for (const table of this.hashTables) {
            table.add(entity, vector);
        }
    }
    query(vector) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((res, rej) => {
                const candidates = [];
                const tables = this.hashTables.entries();
                const loop = () => {
                    const next = tables.next();
                    if (next.done) {
                        res([...new Set(flatten(candidates))]);
                        return;
                    }
                    candidates.push(next.value[1].query(vector));
                    setImmediate(loop);
                };
                setImmediate(loop);
            });
        });
    }
    remove(entity) {
        for (let i = 0, j = this.hashTables.length; i < j; i++) {
            this.hashTables[i].remove(entity);
        }
    }
}
exports.default = LSH;
