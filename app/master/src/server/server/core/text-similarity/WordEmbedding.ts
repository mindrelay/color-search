import Vector from "../common/Vector";

export default class WordEmbedding {

    private word: string;
    private contexts: Vector;

    constructor(word: string, contexts: Vector) {
        this.word = word;
        this.contexts = contexts;
    }

    public getWord(): string {
        return this.word;
    }

    public getContexts(): Vector {
        return this.contexts;
    }

    public toJSON() {
        return {
            word: this.word,
            contexts: this.contexts.toJSON()
        };
    }
}
