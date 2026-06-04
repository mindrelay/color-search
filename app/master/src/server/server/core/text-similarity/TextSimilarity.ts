import {CosineSimilarity, PointsSimilarity} from "../common/Similarity";
import Vector from "../common/Vector";
import {DAOFactory, VectorSemanticsDAO} from "../db-access/DAOFactory";
import MinHash from "../min-hash/MinHash";
import WordEmbeddings from "../word-embeddings/WordEmbeddings";
import WordEmbedding from "./WordEmbedding";
import Debug = require("debug");
const debug = Debug("TextSimilarity");

/**
* Class for calculation of (semantic) similarity between two short texts
*/
export default class TextSimilarity {

    private minHash: MinHash;
    private similarity: PointsSimilarity;
    private alpha: number;
    private wordEmbeddingsPath: string;
    private forceReload: boolean;
    private dao: VectorSemanticsDAO;

    /**
    * Create TextSimilarity instance
    * @param hashes Number of MinHash hashing functions
    * @param alpha Interpolation weight for semantic similarity
    */
    constructor(config: {hashes: number, alpha: number, path: string, forceReload: boolean}) {
        const hashes = typeof config.hashes === "number" ? config.hashes : 100;
        this.minHash = new MinHash(hashes);
        this.alpha = typeof config.alpha === "number" ? config.alpha : 0.8;
        this.wordEmbeddingsPath = config.path ? config.path : "";
        this.forceReload = (config.forceReload === true);
        this.dao = DAOFactory.getVectorSemanticsDAO();
        this.similarity = new CosineSimilarity();
    }

    /**
    * Asynchronous load of word embeddings
    * @param wordEmbeddingsPath Path to the file with word embeddings vectors
    * @param force Force reload of word embeddings. Deletes word embeddings from DB
    * and saves new Vectors from file.
    */
    public async load(wordEmbeddingsPath: string = this.wordEmbeddingsPath,
                      force: boolean = this.forceReload): Promise<void> {
        const wordEmbeddings: WordEmbeddings = new WordEmbeddings();
        const embeddings: WordEmbedding[] = new Array<WordEmbedding>();
        try {
            const count = await this.dao.count();
            debug("word embeddings db count: " + count);
            if (force || count < 1) {
                if (count > 0 ) {
                    await this.dao.clear();
                    debug("delete word embeddings...");
                }
                debug("load word embeddings...");
                debug("path: " + wordEmbeddingsPath);
                await wordEmbeddings.load(wordEmbeddingsPath);
                debug("word embeddings load finished...");
                const iterator = wordEmbeddings.iterator();
                for (const embedding of iterator) {
                    embeddings.push(new WordEmbedding(embedding[0], new Vector(embedding[1])));
                }
                wordEmbeddings.clear();
                await this.dao.saveMany(embeddings);
                debug("embeddings count: " + embeddings.length);
            }
        }catch (e) {
            console.log(e);
            throw new Error("TextSimilarity loading error");
        }
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

    /**
    * Calculate normalized text embedding for given set of terms
    * @param terms Terms, for example words or n-gramms
    * @returns Promise of text embedding
    */
    public async textEmbedding(terms: string[]): Promise<Vector> {
        const embedding = await this.dao.getTextEmbedding(terms);
        return embedding ? embedding.normalizeL2() : new Vector();
    }

    /**
    * Calculate MinHash signature for given set of terms
    * @param terms Terms, for example words or n-gramms
    * @returns MinHash signature
    */
    public minHashSignature(terms: string[]): Vector {
        return this.minHash.hash(terms);
    }
}
