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
const Vector_1 = require("../../common/Vector");
const Settings_1 = require("../../Settings");
const Debug = require("debug");
const debug = Debug("VectorSemanticsDAOMongo");
/**
* Data Access Object class for managing word embeddings in MongoDB database
*/
class VectorSemanticsDAOMongo {
    constructor() {
        this.db = Settings_1.default.db();
        this.wordEmbeddings = "wordembeddings";
    }
    /** Create text embedding
    * @param terms Array of terms/words
    * @return text embedding vector
    */
    getTextEmbedding(terms) {
        return __awaiter(this, void 0, void 0, function* () {
            const max = 100000;
            let embedding = null;
            if (terms.length > max) {
                terms.length = max;
            }
            const collection = yield this.db.connection(this.wordEmbeddings);
            return yield new Promise((res, rej) => {
                collection.find({ word: { $in: terms } }).batchSize(100)
                    .forEach((doc) => {
                    if (embedding) {
                        embedding.add(new Vector_1.default(doc.contexts), true);
                    }
                    else {
                        embedding = new Vector_1.default(doc.contexts);
                    }
                }, (end) => {
                    res(embedding);
                });
            });
        });
    }
    /** Save a portion of word embeddings in s database
    * @param wordEmbeddings Array of word embeddings
    */
    saveMany(wordEmbeddings) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collection = yield this.db.connection(this.wordEmbeddings);
                yield collection.createIndex({ word: 1 }, { unique: true });
                yield collection.insertMany(wordEmbeddings.map((embedding) => embedding.toJSON()), { ordered: false });
            }
            catch (e) {
                console.error(e);
                return Promise.reject(new Error("Error occured. WordEmbeddings not saved"));
            }
        });
    }
    /** Returns a number of word embeddings in a database
    * @return number of word embeddings
    */
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collection = yield this.db.connection(this.wordEmbeddings);
                return yield collection.count();
            }
            catch (e) {
                console.error(e);
                return 0;
            }
        });
    }
    /** Deletes all word embeddings in database */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collection = yield this.db.connection(this.wordEmbeddings);
                yield collection.drop();
            }
            catch (e) {
                console.error(e);
                return Promise.reject(new Error("Error occured. WordEmbeddings not deleted"));
            }
        });
    }
}
exports.default = VectorSemanticsDAOMongo;
