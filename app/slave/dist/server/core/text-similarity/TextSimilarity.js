"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const Similarity_1 = require("../common/Similarity");
const MinHash_1 = require("../min-hash/MinHash");
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
        this.similarity = new Similarity_1.CosineSimilarity();
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
}
exports.default = TextSimilarity;
