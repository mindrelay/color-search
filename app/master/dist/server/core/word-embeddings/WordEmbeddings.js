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
const fs = require("fs");
const readline = require("readline");
const Vector_1 = require("../common/Vector");
/**
* Word embeddings super class. Can load in RAM and save word embeddings from
* text files.
*/
class WordEmbeddings {
    constructor() {
        this.matrix = new Map();
        this.done = false;
    }
    /**
    * Save word embeddings to the text file
    * Word embeddings file has following JSON format: ['term',[d1,d2,d3,...,dn]] for ech line
    * @param file Path to the word embeddings file
    */
    save(file) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            return yield new Promise((res, rej) => {
                const writeStream = fs.createWriteStream(file, { encoding: "utf-8" });
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
                        }
                        else {
                            break;
                        }
                    }
                    if (!element || element.done) {
                        writeStream.end();
                    }
                };
                write();
            });
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
    load(file, dimensions = -1, startLine = 0, maxLines) {
        return __awaiter(this, void 0, void 0, function* () {
            this.matrix = new Map();
            const self = this;
            return yield new Promise((res, rej) => {
                let lineIndex = 0;
                let count = 0;
                const rl = readline.createInterface({
                    input: fs.createReadStream(file, { encoding: "utf-8" })
                });
                rl.on("line", (line) => {
                    lineIndex++;
                    if (lineIndex >= startLine && count !== maxLines) {
                        const tupel = JSON.parse(line);
                        const values = tupel[1].map((val) => parseFloat(val));
                        if (dimensions > 0 && values.length > dimensions) {
                            values.length = dimensions;
                        }
                        this.matrix.set(tupel[0], values);
                        count++;
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
        });
    }
    /**
    * Get word vector for given term/word
    * @returns Word embedding vector
    */
    wordVector(term) {
        const values = this.matrix.get(term);
        return values ? new Vector_1.default(values) : null;
    }
    /**
    * Get number of word embeddings dimensions
    */
    dimensionsCount() {
        const matrixValuesIterator = this.matrix.values();
        const dimensionsCount = matrixValuesIterator.next().value ?
            matrixValuesIterator.next().value.length : null;
        return dimensionsCount;
    }
    /**
    * Clears word embeddings matrix
    */
    clear() {
        this.matrix.clear();
        this.done = false;
    }
    /**
    * Iterator for word embeddings matrix
    */
    iterator() {
        return this.matrix.entries();
    }
}
exports.default = WordEmbeddings;
