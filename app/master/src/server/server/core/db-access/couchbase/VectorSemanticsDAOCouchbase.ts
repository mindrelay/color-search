 // tslint:disable:forin
import Vector from "../../common/Vector";
import Settings from "../../Settings";
import WordEmbedding from "../../text-similarity/WordEmbedding";
import {VectorSemanticsDAO} from "../DAOInterfaces";
import Debug = require("debug");
const couchbase = require("couchbase");
const debug = Debug("VectorSemanticsDAOMongo");

export default class VectorSemanticsDAOCouchbase implements VectorSemanticsDAO {

    private db: any;
    private nodeId: number;
    private amountQuery: any;
    private deleteQuery: any;

    constructor() {
        this.db = Settings.db();
        this.nodeId = Settings.global().id;
        this.amountQuery = couchbase.N1qlQuery
        .fromString(`SELECT COUNT(*) as count FROM wordembeddings`);
        this.deleteQuery = couchbase.N1qlQuery
        .fromString(`DELETE FROM wordembeddings`);

    }

    /** Create text embedding
    * @param terms Array of terms/words
    * @return text embedding vector
    */
    public async getTextEmbedding(terms: string[], max: number = 100000): Promise<Vector> {
        let embedding: Vector = null;
        if (terms.length > max) {
            terms.length = max;
        }
        if (terms.length > 0) {
            const bucket = await this.db.connection("wordembeddings");
            await new Promise<Vector>((res, rej) => {
                bucket.getMulti(terms, {}, (error, result) => {
                    for (const key in result) {
                        const doc = result[key].value;
                        if (embedding && doc && doc.contexts) {
                            embedding.add(new Vector(doc.contexts), true);
                        } else if (!embedding && doc && doc.contexts) {
                            embedding = new Vector(doc.contexts);
                        }
                    }
                    res();
                });
            });
        }
        return embedding;
    }

    /** Save a portion of word embeddings in s database
    * @param wordEmbeddings Array of word embeddings
    */
    public async saveMany(wordEmbeddings: WordEmbedding[]): Promise<void> {
        const bucket = await this.db.connection("wordembeddings");
        await new Promise((res, rej) => {
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
                        } else {
                            res();
                        }
                    }
                );
            };
            loop();
        });
    }

    /** Returns a number of word embeddings in a database
    * @return number of word embeddings
    */
    public async count(): Promise<number> {
        const bucket = await this.db.connection("wordembeddings");
        return await new Promise<number>((res, rej) => {
            bucket.query(this.amountQuery, {}, (err, rows) => {
                if (err || !rows || rows.length < 1) {
                    console.log(err);
                    res(0);
                } else if (rows && rows.length > 0) {
                    res(Number.parseInt(rows[0].count));
                }
            });
        });
    }

    /** Deletes all word embeddings in database */
    public async clear(): Promise<void> {
        const bucket = await this.db.connection("wordembeddings");
        return new Promise<void>((res, rej) => {
            bucket.query(this.deleteQuery, {}, (err, result) => {
                if (err) {
                    console.log(err);
                }
                res();
            });
        });
    }
}
