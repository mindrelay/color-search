/**
* Represents a word node in the parsing tree. Contains DOM node
* for fast access and modifications.
* @constructor
* @param {Service} colorService Angularjs 'colorService' service
* @param {Factory} calcFontcolor Angularjs factory for calculation of font color according to the background color
* @memberof module:text-colorizer
*/
class Words {
    constructor(colorService, calcFontColor) {
        this.wordNodes = new Map();
        this.wordToWordNodes = new Map();
        this.colorFactory = colorService;
        this.calcFontColor = calcFontColor;
    }

    /** Assigns new dom node to the word node by id.
    * @method updateWordNode
    * @param {number} id Word node id
    * @param {Object} $domNode DOM node in jquery wrapper
    * @memberof module:text-colorizer.Words
    * @instance
    */
    updateWordNode(id, $domNode) {
        const wordNode = this.wordNodes.get(id);
        if (wordNode) {
            wordNode.$domNode = $domNode;
        }
    }


    /** Get all word nodes associated with given word.
    * @method getWordNodes
    * @param {string} word Word
    * @memberof module:text-colorizer.Words
    * @return {WordNode[]}
    * @instance
    */
    getWordNodes(word) {
        return this.wordToWordNodes.get(word);
    }

    /** Returns word node by its id.
    * @method getWordNode
    * @param {number} id - Word node id
    * @return {WordNode}
    * @memberof module:text-colorizer.Words
    * @instance
    */
    getWordNode(id) {
        return this.wordNodes.get(id);
    }

    /** Returns ids of all word nodes.
    * @method getIds
    * @return {number[]}
    * @memberof module:text-colorizer.Words
    * @instance
    */
    getIds() {
        return this.wordNodes.keys();
    }

    /** Returns all word nodes.
    * @method getAllWordNodes
    * @return {WordNode[]}
    * @memberof module:text-colorizer.Words
    * @instance
    */
    getAllWordNodes() {
        return this.wordNodes;
    }

    /** Returns a HashMap
    * @method getWordsToWordNodesMap
    * @return {Map<string, WordNode[]>}
    * @memberof module:text-colorizer.Words
    * @instance
    */
    getWordsToWordNodesMap() {
        return this.wordToWordNodes;
    }

    /** Inserts new word node.
    * @method addWordNode
    * @param {WordNode} wordNode
    * @memberof module:text-colorizer.Words
    * @instance
    */
    addWordNode(wordNode) {
        this.wordNodes.set(wordNode.id, wordNode);
        if (!this.wordToWordNodes.has(wordNode.word)) {
            this.wordToWordNodes.set(wordNode.word, new Map());
        }
        const wordNodes = this.wordToWordNodes.get(wordNode.word);
        wordNodes.set(wordNode.id, wordNode);
    }

    /** Removes word node by id.
    * @method removeWordNode
    * @param {number} id
    * @memberof module:text-colorizer.Words
    * @instance
    */
    removeWordNode(id) {
        this.wordNodes.delete(id);
        for (const wordNodes of this.wordToWordNodes.values()) {
            if (wordNodes.has(id)) {
                wordNodes.delete(id);
                break;
            }
        }
    }

    /** Reset colors of word node by id.
    * Resets all word nodes with the same word.
    * @method resetColor
    * @param {number} id
    * @memberof module:text-colorizer.Words
    * @instance
    */
    resetColor(id) {
        const wordNode = this.wordNodes.get(id);
        const wordNodes = this.wordToWordNodes.get(wordNode.word);
        for (const node of wordNodes.values()) {
            node.resetColor();
        }
    }

    /** Resets color only in word node with given id.
    * @method resetOneColor
    * @param {number} id
    * @memberof module:text-colorizer.Words
    * @instance
    */
    resetOneColor(id) {
        const wordNode = this.wordNodes.get(id);
        wordNode.resetColor();
    }

    /** Set color in one specific word node by given id.
    * @method setColorOnce
    * @param {number} id Word node id
    * @param {Color} color Color object
    * @memberof module:text-colorizer.Words
    * @instance
    */
    setColorOnce(id, color) {
        const fontColor = this.calcFontColor(color);
        const wordNode = this.wordNodes.get(id);
        wordNode.setColor(color, fontColor);
    }

    /** Set color in all word nodes with the same word by given id.
    * @method setColor
    * @param {number} id Word node id
    * @param {Color} color Color object
    * @memberof module:text-colorizer.Words
    * @instance
    */
    setColor(id, color) {
        const wordNode = this.wordNodes.get(id);
        this.setColorByWord(wordNode.word, color);
    }

    /** Set color in all word nodes with the same word by given word.
    * @method setColorByWord
    * @param {string} word Word
    * @param {Color} color Color object
    * @memberof module:text-colorizer.Words
    * @instance
    */
    setColorByWord(word, color) {
        const wordNodes = this.wordToWordNodes.get(word);
        if (wordNodes) {
            const fontColor = this.calcFontColor(color);
            for (const node of wordNodes.values()) {
                node.setColor(color, fontColor);
            }
        }
    }

    /** Resets all word nodes (decolorize words).
    * @method resetAllColors
    * @memberof module:text-colorizer.Words
    * @instance
    */
    resetAllColors() {
        for (const wordNode of this.wordNodes.values()) {
            wordNode.resetColor();
        }
    }

    /** Deletes all word nodes
    * @method clear
    * @memberof module:text-colorizer.Words
    * @instance
    */
    clear() {
        this.wordNodes.clear();
        this.wordToWordNodes.clear();
    }
}

export default Words;
