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
const numeric = require("numeric");
const WordEmbeddings_1 = require("./WordEmbeddings");
class PPMI extends WordEmbeddings_1.default {
    /**
    * Create PPMI instance
    * @param window Co-occurance window length. Common values are 5-10.
    * @param dictionary Dictionary of words/terms
    * @param contexts Contexts for word embeddings.
    */
    constructor(window = 7, dictionary = [], contexts) {
        super();
        this.done = false;
        this.window = window;
        this.contexts = new Map();
        const conts = contexts ? contexts : dictionary;
        for (let i = 0; i < conts.length; i++) {
            this.contexts.set(conts[i], i);
        }
        for (const word of dictionary) {
            const con = new Array(conts.length).fill(0);
            this.matrix.set(word, con);
        }
    }
    /**
    * Learn co-occurances for the given text chunk
    * @param txt Text chunk
    */
    learn(txt) {
        if (!this.done) {
            for (let i = 0; i < txt.length; i++) {
                if (this.matrix.has(txt[i])) {
                    const matrixWord = this.matrix.get(txt[i]);
                    const s = i - this.window;
                    const e = i + this.window;
                    const start = (s < 0) ? 0 : s;
                    const end = (e > txt.length) ? txt.length : e;
                    for (let j = start; j < end; j++) {
                        if (this.contexts.has(txt[j]) && i !== j) {
                            const index = this.contexts.get(txt[j]);
                            matrixWord[index]++;
                        }
                    }
                }
            }
        }
    }
    /**
    * Calculate PPMI values from co-occurance matrix and evaluate
    * SVD dimension reduction if needed. Creates PPMI word embeddings matrix.
    * @param dimensions Maximum number of dimensions.
    * If not specified, SVD will not be applied.
    */
    complete(dimensions) {
        return __awaiter(this, void 0, void 0, function* () {
            this.contexts.clear();
            const pw = new Map();
            const pc = new Map();
            // laplace add-2 smoothing
            const smooth = 2;
            for (const wordContexts of this.matrix.values()) {
                for (let i = 0; i < wordContexts.length; i++) {
                    wordContexts[i] += smooth;
                }
            }
            // calculate ppmi matrix
            let sum = 0;
            for (const wordContexts of this.matrix.values()) {
                for (let i = 0; i < wordContexts.length; i++) {
                    sum += wordContexts[i];
                }
            }
            for (const [word, wordContexts] of this.matrix) {
                let ws = 0;
                for (let i = 0; i < wordContexts.length; i++) {
                    ws += wordContexts[i];
                }
                pw.set(word, ws / sum);
            }
            const matrixValuesIterator = this.matrix.values();
            const contextsCount = matrixValuesIterator.next().value.length;
            for (let i = 0; i < contextsCount; i++) {
                let ws = 0;
                for (const wordContexts of this.matrix.values()) {
                    ws += wordContexts[i];
                }
                pc.set(i, ws / sum);
            }
            for (const [word, wordContexts] of this.matrix) {
                for (let i = 0; i < wordContexts.length; i++) {
                    const value = wordContexts[i] / sum;
                    wordContexts[i] = wordContexts[i] > smooth ?
                        Math.round(Math.max(Math.log2(value / (pw.get(word) * pc.get(i))), 0) * 1e2) / 1e2 : 0;
                }
            }
            if (dimensions && dimensions > 0) {
                // SVD dimension reduction
                const words = Array.from(this.matrix.keys());
                const m = Array.from(this.matrix.values());
                this.matrix.clear();
                let U = numeric.svd(m).U;
                for (let i = 0; i < words.length; i++) {
                    const cons = U[i].slice(0, dimensions);
                    this.matrix.set(words[i], cons);
                }
                U = null;
            }
            this.done = true;
        });
    }
}
