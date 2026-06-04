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
const Similarity_1 = require("../common/Similarity");
const Vector_1 = require("../common/Vector");
const DAOFactory_1 = require("../db-access/DAOFactory");
const MinHash_1 = require("../min-hash/MinHash");
const WordEmbeddings_1 = require("../word-embeddings/WordEmbeddings");
const WordEmbedding_1 = require("./WordEmbedding");
const Debug = require("debug");
const debug = Debug("TextSimilarity");
/**
* Class for calculation of (semantic) similarity between two short texts
*/
class TextSimilarity {
    /**
    * Create TextSimilarity instance
    * @param hashes Number of MinHash hashing functions
    * @param alpha Interpolation weight for semantic similarity
    */
    constructor(config) {
        const hashes = typeof config.hashes === "number" ? config.hashes : 100;
        this.minHash = new MinHash_1.default(hashes);
        this.alpha = typeof config.alpha === "number" ? config.alpha : 0.8;
        this.wordEmbeddingsPath = config.path ? config.path : "";
        this.forceReload = (config.forceReload === true);
        this.dao = DAOFactory_1.DAOFactory.getVectorSemanticsDAO();
        this.similarity = new Similarity_1.CosineSimilarity();
    }
    /**
    * Asynchronous load of word embeddings
    * @param wordEmbeddingsPath Path to the file with word embeddings vectors
    * @param force Force reload of word embeddings. Deletes word embeddings from DB
    * and saves new Vectors from file.
    */
    load(wordEmbeddingsPath = this.wordEmbeddingsPath, force = this.forceReload) {
        return __awaiter(this, void 0, void 0, function* () {
            const wordEmbeddings = new WordEmbeddings_1.default();
            const embeddings = new Array();
            try {
                const count = yield this.dao.count();
                debug("word embeddings db count: " + count);
                if (force || count < 1) {
                    if (count > 0) {
                        yield this.dao.clear();
                        debug("delete word embeddings...");
                    }
                    debug("load word embeddings...");
                    debug("path: " + wordEmbeddingsPath);
                    yield wordEmbeddings.load(wordEmbeddingsPath);
                    debug("word embeddings load finished...");
                    const iterator = wordEmbeddings.iterator();
                    for (const embedding of iterator) {
                        embeddings.push(new WordEmbedding_1.default(embedding[0], new Vector_1.default(embedding[1])));
                    }
                    wordEmbeddings.clear();
                    yield this.dao.saveMany(embeddings);
                    debug("embeddings count: " + embeddings.length);
                }
            }
            catch (e) {
                console.log(e);
                throw new Error("TextSimilarity loading error");
            }
        });
    }
    /**
    * Calculate similarity score between text1 and text2
    * @param minhashSignature1 MinHash signature of text1
    * @param textEmbedding1 Text embedding of text1
    * @param minhashSignature2 MinHash signature of text1
    * @param textEmbedding2 Text tmbedding of text1
    * @returns Similarity score between 0 and 1
    */
    similarityScore(minhashSignature1, textEmbedding1, minhashSignature2, textEmbedding2) {
        return Math.max(this.similarity.calculate(textEmbedding1, textEmbedding2, true), 0) * this.alpha +
            (1 - this.alpha) * this.minHash.similarity(minhashSignature1, minhashSignature2);
    }
    /**
    * Calculate normalized text embedding for given set of terms
    * @param terms Terms, for example words or n-gramms
    * @returns Promise of text embedding
    */
    textEmbedding(terms) {
        return __awaiter(this, void 0, void 0, function* () {
            const embedding = yield this.dao.getTextEmbedding(terms);
            return embedding ? embedding.normalizeL2() : new Vector_1.default();
        });
    }
    /**
    * Calculate MinHash signature for given set of terms
    * @param terms Terms, for example words or n-gramms
    * @returns MinHash signature
    */
    minHashSignature(terms) {
        return this.minHash.hash(terms);
    }
}
exports.default = TextSimilarity;
