import Debug = require("debug");
import {CosineSimilarity, PointsSimilarity} from "../common/Similarity";
import Vector from "../common/Vector";
import MinHash from "../min-hash/MinHash";
const debug = Debug("TextSimilarity");

/**
* Class for calculation of (semantic) similarity between two short texts
*/
export default class TextSimilarity {

    private minHash: MinHash;
    private similarity: PointsSimilarity;
    private alpha: number;

    /**
    * Create TextSimilarity instance
    * @param hashes Number of MinHash hashing functions
    * @param alpha Interpolation weight for semantic similarity
    */
    constructor(config: {hashes: number, alpha: number}) {
        const hashes = typeof config.hashes === "number" ? config.hashes : 100;
        this.minHash = new MinHash(hashes);
        this.alpha = typeof config.alpha === "number" ? config.alpha : 0.8;
        this.similarity = new CosineSimilarity();
    }

    /**
    * Calculate similarity score between text1 and text2
    * @param minhashSignature1 MinHash signature of text1
    * @param textEmbedding1 Text embedding of text1
    * @param minhashSignature2 MinHash signature of text1
    * @param textEmbedding2 Text tmbedding of text1
    * @returns Similarity score between 0 and 1
    */
    public similarityScore(minhashSignature1: Vector, textEmbedding1: Vector,
                           minhashSignature2: Vector, textEmbedding2: Vector): number {
        return Math.max(this.similarity.calculate(textEmbedding1, textEmbedding2, true), 0) * this.alpha +
        (1 - this.alpha) * this.minHash.similarity(minhashSignature1, minhashSignature2);
    }
}
