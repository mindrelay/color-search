import Vector from "../../common/Vector";
import Settings from "../../Settings";
import WordEmbedding from "../../text-similarity/WordEmbedding";
import {VectorSemanticsDAO} from "../DAOInterfaces";
import Debug = require("debug");
const debug = Debug("VectorSemanticsDAOMongo");

/**
* Data Access Object class for managing word embeddings in MongoDB database
*/
export default class VectorSemanticsDAOMongo implements VectorSemanticsDAO {

    private db: any;
    private wordEmbeddings: string;

    constructor() {
        this.db = Settings.db();
        this.wordEmbeddings = "wordembeddings";
    }

    /** Create text embedding
    * @param terms Array of terms/words
    * @return text embedding vector
    */
    public async getTextEmbedding(terms: string[]): Promise<Vector> {
        const max = 100000;
        let embedding: Vector = null;
        if (terms.length > max) {
            terms.length = max;
        }
        const collection = await this.db.connection(this.wordEmbeddings);
        return await new Promise<Vector>((res, rej) => {
            collection.find({word: {$in: terms}}).batchSize(100)
            .forEach((doc) => {
                if (embedding) {
                    embedding.add(new Vector(doc.contexts), true);
                } else {
                    embedding = new Vector(doc.contexts);
                }
            },
            (end) => {
                res(embedding);
            });
        });
    }

    /** Save a portion of word embeddings in s database
    * @param wordEmbeddings Array of word embeddings
    */
    public async saveMany(wordEmbeddings: WordEmbedding[]): Promise<void> {
        try {
            const collection = await this.db.connection(this.wordEmbeddings);
            await collection.createIndex({word: 1}, {unique: true});
            await collection.insertMany(wordEmbeddings.map((embedding) => embedding.toJSON()), {ordered: false});
        } catch (e) {
            console.error(e);
            return Promise.reject(new Error("Error occured. WordEmbeddings not saved"));
        }
    }

    /** Returns a number of word embeddings in a database
    * @return number of word embeddings
    */
    public async count(): Promise<number> {
        try {
            const collection = await this.db.connection(this.wordEmbeddings);
            return await collection.count();
        } catch (e) {
            console.error(e);
            return 0;
        }
    }

    /** Deletes all word embeddings in database */
    public async clear(): Promise<void> {
        try {
            const collection = await this.db.connection(this.wordEmbeddings);
            await collection.drop();
        } catch (e) {
            console.error(e);
            return Promise.reject(new Error("Error occured. WordEmbeddings not deleted"));
        }
    }
}
