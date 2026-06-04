"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WordEmbedding {
    constructor(word, contexts) {
        this.word = word;
        this.contexts = contexts;
    }
    getWord() {
        return this.word;
    }
    getContexts() {
        return this.contexts;
    }
    toJSON() {
        return {
            word: this.word,
            contexts: this.contexts.toJSON()
        };
    }
}
exports.default = WordEmbedding;
