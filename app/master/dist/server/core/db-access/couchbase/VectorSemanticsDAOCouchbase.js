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
// tslint:disable:forin
const Vector_1 = require("../../common/Vector");
const Settings_1 = require("../../Settings");
const Debug = require("debug");
const couchbase = require("couchbase");
const debug = Debug("VectorSemanticsDAOMongo");
class VectorSemanticsDAOCouchbase {
    constructor() {
        this.db = Settings_1.default.db();
        this.nodeId = Settings_1.default.global().id;
        this.amountQuery = couchbase.N1qlQuery
            .fromString(`SELECT COUNT(*) as count FROM wordembeddings`);
        this.deleteQuery = couchbase.N1qlQuery
            .fromString(`DELETE FROM wordembeddings`);
    }
    /** Create text embedding
    * @param terms Array of terms/words
    * @return text embedding vector
    */
    getTextEmbedding(terms, max = 100000) {
        return __awaiter(this, void 0, void 0, function* () {
            let embedding = null;
            if (terms.length > max) {
                terms.length = max;
            }
            if (terms.length > 0) {
                const bucket = yield this.db.connection("wordembeddings");
                yield new Promise((res, rej) => {
                    bucket.getMulti(terms, {}, (error, result) => {
                        for (const key in result) {
                            const doc = result[key].value;
                            if (embedding && doc && doc.contexts) {
                                embedding.add(new Vector_1.default(doc.contexts), true);
                            }
                            else if (!embedding && doc && doc.contexts) {
                                embedding = new Vector_1.default(doc.contexts);
                            }
                        }
                        res();
                    });
                });
            }
            return embedding;
        });
    }
    /** Save a portion of word embeddings in s database
    * @param wordEmbeddings Array of word embeddings
    */
    saveMany(wordEmbeddings) {
        return __awaiter(this, void 0, void 0, function* () {
            const bucket = yield this.db.connection("wordembeddings");
            yield new Promise((res, rej) => {
                const step = 500;
                let offset = 0;
                const loop = () => {
                    const part = wordEmbeddings.slice(offset, offset + step);
                    let queryString = "";
                    for (let i = 0; i < part.length; i++) {
                        queryString += `VALUES ("${part[i].getWord()}", ${JSON.stringify(part[i].toJSON())})`;
                        queryString = part[i + 1] ? queryString.concat(",") : queryString.concat(";");
                    }
                    const query = couchbase.N1qlQuery.fromString(`INSERT INTO wordembeddings (KEY, VALUE) ${queryString}`);
                    bucket.query(query, {}, (err, rows) => {
                        if (err) {
                            console.log(err);
                        }
                        offset += step;
                        if (offset < wordEmbeddings.length) {
                            loop();
                        }
                        else {
                            res();
                        }
                    });
                };
                loop();
            });
        });
    }
    /** Returns a number of word embeddings in a database
    * @return number of word embeddings
    */
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            const bucket = yield this.db.connection("wordembeddings");
            return yield new Promise((res, rej) => {
                bucket.query(this.amountQuery, {}, (err, rows) => {
                    if (err || !rows || rows.length < 1) {
                        console.log(err);
                        res(0);
                    }
                    else if (rows && rows.length > 0) {
                        res(Number.parseInt(rows[0].count));
                    }
                });
            });
        });
    }
    /** Deletes all word embeddings in database */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const bucket = yield this.db.connection("wordembeddings");
            return new Promise((res, rej) => {
                bucket.query(this.deleteQuery, {}, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    res();
                });
            });
        });
    }
}
exports.default = VectorSemanticsDAOCouchbase;
