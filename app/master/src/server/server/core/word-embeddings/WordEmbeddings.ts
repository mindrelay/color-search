import fs = require("fs");
import readline = require("readline");
import Vector from "../common/Vector";

/**
* Word embeddings super class. Can load in RAM and save word embeddings from
* text files.
*/
export default class WordEmbeddings {

    protected matrix: Map<string, number[]>;
    protected done: boolean;

    constructor() {
        this.matrix = new Map<string, number[]>();
        this.done = false;
    }

    /**
    * Save word embeddings to the text file
    * Word embeddings file has following JSON format: ['term',[d1,d2,d3,...,dn]] for ech line
    * @param file Path to the word embeddings file
    */
    public async save(file: string) {
        const self = this;
        return await new Promise((res, rej) => {
            const writeStream = fs.createWriteStream(file, {encoding: "utf-8"});
            writeStream.on("error", (error) => {
                rej(error);
            });
            writeStream.on("finish", () => {
                res();
            });
            const matrixIterator = self.matrix[Symbol.iterator]();
            const write = () => {
                let element = null;
                while (element = matrixIterator.next()) {
                    if (element && element.value && !element.done) {
                        if (!writeStream.write(JSON.stringify([element.value[0], element.value[1]]) + "\n")) {
                            writeStream.once("drain", write);
                            break;
                        }
                    } else {
                        break;
                    }
                }
                if (!element || element.done) {
                    writeStream.end();
                }
            };
            write();
        });
    }

    /**
    * Load word embeddings into RAM from text file.
    * Word embeddings file must have following JSON format: ['term',[d1,d2,d3,...,dn]] for ech line
    * @param file Path to the word embeddings file
    * @param dimensions Reduces the number of word embeddings dimensions
    * This value must be greater 0 and smaller then number of dimensions in the loaded vectors.
    * All parameter values <= 0 will be ignored and vectors will not be reduced
    * @param startLine Line in file start to read from
    * @param maxLine Maximum lines to read
    */
    public async load(file: string, dimensions: number = -1, startLine: number = 0, maxLines?: number): Promise<void> {
        this.matrix = new Map<string, number[]>();
        const self = this;
        return await new Promise<void>((res, rej) => {
            let lineIndex = 0;
            let count = 0;
            const rl = readline.createInterface({
                input: fs.createReadStream(file, {encoding: "utf-8"})
            });
            rl.on("line", (line) => {
                lineIndex ++;
                if (lineIndex >= startLine && count !== maxLines) {
                    const tupel = JSON.parse(line);
                    const values = tupel[1].map((val) => parseFloat(val));
                    if (dimensions > 0 && values.length > dimensions) {
                        values.length = dimensions;
                    }
                    this.matrix.set(tupel[0], values);
                    count ++;
                }
            });
            rl.on("close", () => {
                self.done = true;
                res();
            });
            rl.on("error", (error) => {
                rej(error);
            });
        });
    }

    /**
    * Get word vector for given term/word
    * @returns Word embedding vector
    */
    public wordVector(term: string): Vector {
        const values = this.matrix.get(term);
        return values ? new Vector(values) : null;
    }

    /**
    * Get number of word embeddings dimensions
    */
    public dimensionsCount(): number {
        const matrixValuesIterator = this.matrix.values();
        const dimensionsCount = matrixValuesIterator.next().value ?
        matrixValuesIterator.next().value.length : null;
        return dimensionsCount;
    }

    /**
    * Clears word embeddings matrix
    */
    public clear() {
        this.matrix.clear();
        this.done = false;
    }

    /**
    * Iterator for word embeddings matrix
    */
    public iterator(): IterableIterator<[string, number[]]> {
        return this.matrix.entries();
    }
}
