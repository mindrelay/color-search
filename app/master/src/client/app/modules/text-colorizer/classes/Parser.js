import XRegExp from 'xregexp';
import WordNode from './WordNode';

/**
* Parser for parsing user text in text editor. Splits text into words and handles
* changes in already dicovered words.
* @constructor
* @param {Object} $  Jquery selector for element in the component scope
* @param {Service} $window  Angularjs '$window' service wrapper for window object
* @param {Object} $root Juery selector for text editor
* @param {Service} colorService 'colorService' service
* @param {Words} words Words
* @memberof module:text-colorizer
*/
class Parser {

    constructor($, $window, $root, colorService, words) {
        this.$ = $;
        this.$window = $window;
        this.$root = $root;
        this._colorService = colorService;
        this._idCounter = 0;
        this._words = words;
        this._wordRegex = XRegExp("\\pL+(?:[-'’]?\\pL+)*", 'gi');
        this._wordFormatRegex = XRegExp("^(?:\\pL+(?:[-'’]?\\pL+)*)$", 'i');
    }

    /** Parse text in text editor and splits it into separate words.
    * There are two different nodes possible: raw text nodes and
    * already processed (and eventually colorized) words.
    * Raw text nodes will be splitted into separate words. Word nodes will be checked
    * for changes. If the word node containes actually more than one word,
    * it will be splitted in multiple word nodes with new ids.
    * @method parse
    * @memberof module:text-colorizer.Parser
    * @instance
    */
    parse() {
        this._parseElement(this.$root);
    }

    _createWordDOMNode(id, txt, backgroundColor, fontColor, cssClass) {
        const element = this.$window.document.createElement("span");
        element.setAttribute("data-word", id);
        element.setAttribute("style", `background-color: ${backgroundColor}; color: ${fontColor};`);
        const textNode = this._createTextDOMNode(txt);
        element.appendChild(textNode);
        if (cssClass) {
            element.setAttribute("class", cssClass);
        } else {
            element.setAttribute("class", "unselected");
        }
        return element;
    }

    _createTextDOMNode(text) {
        return this.$window.document.createTextNode(text);
    }

    _parseElement(element) {
        this.$(element).contents()
        .each((i, node) => {
            switch (node.nodeType) {
                case 1:
                    if (!node.hasAttribute("data-word")) {
                        this._parseElement(node);
                    } else {
                        this._analyzeWordElement(node);
                    } break;
                case 3: this._parseTextNode(node); break;
                default: break;
            }
        });
    }

    _parseText(node, txt, callback) {
        const DOMNodes = [];
        let result = [];
        let index = 0;
        let textLength = 0;
        while ((result = this._wordRegex.exec(txt)) !== null) {
            const needle = result[0];
            const currentIndex = result.index;
            if (currentIndex - index + textLength > 1) {
                const text = txt.substring(index + textLength, currentIndex);
                const notWord = this._createTextDOMNode(text);
                DOMNodes.push(notWord);
            }
            index = currentIndex;
            textLength = needle.length;
            const wordDOMNode = callback(needle);
            DOMNodes.push(wordDOMNode);
        }
        if (index + textLength < txt.length) {
            const text = txt.substring(index + textLength);
            const notWord = this._createTextDOMNode(text);
            DOMNodes.push(notWord);
        }
        if (DOMNodes.length > 0) {
            this.$(node).replaceWith(DOMNodes);
        }
    }

    _parseTextNode(node) {
        this._parseText(node, node.nodeValue, (needle) => {
            const id = this._idCounter++;
            const domNode = this._createWordDOMNode(id, needle);
            const wordNode = new WordNode(id, needle.toLowerCase(),
            this._colorService.getColorInstance(), this.$(domNode));
            this._words.addWordNode(wordNode);
            return domNode;
        });
    }

    _analyzeWordElement(element) {
        const $word = this.$(element);
        const id = parseInt($word.attr("data-word"), 10);
        const elementText = $word.text();
        const text = elementText.trim();
        const wordNode = this._words.getWordNode(id);
        if (elementText.length > text.length) {
            $word.text(text);
        }
        if (!text.match(this._wordFormatRegex) || wordNode.word.trim() !== text) {
            const backgroundColor = $word.css("background-color");
            const cssClass = $word.attr('class');
            const fontColor = $word.css("color");
            this._words.removeWordNode(id);
            this._parseText($word, text, (needle) => {
                const newId = this._idCounter++;
                const domNode = this._createWordDOMNode(newId, needle,
                                backgroundColor, fontColor, cssClass);
                const newWordNode = new WordNode(newId, needle.toLowerCase(),
                this._colorService.getColorInstance(wordNode.color), this.$(domNode));
                this._words.addWordNode(newWordNode);
                return domNode;
            });
        }
    }
}

export default Parser;
