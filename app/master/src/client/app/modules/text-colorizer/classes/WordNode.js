/**
* Represents a word node in the parsing tree. Contains DOM node
* for fast access and modifications.
* @constructor
* @param {Number} id Id of the word node
* @param {String} word Word
* @param {Color} color Color
* @param {Object} $domNode DOM node in jquery wrapper
* @property {Number} id
* @property {String} word
* @property {HSLColor} color
* @property {Object} $domNode
* @memberof module:text-colorizer
*/

class WordNode {
    constructor(id, word, color, $domNode) {
        this.id = id;
        this.word = word;
        this.color = color;
        this.$domNode = $domNode;
    }

    /** Resets color object and style in dom node.
    * @method resetColor
    * @memberof module:text-colorizer.WordNode
    * @instance
    */
    resetColor() {
        this.color.reset();
        this.$domNode.removeAttr("style");
        this.$domNode.removeClass();
        this.$domNode.addClass("unselected");
    }

    /** Set color
    * @method setColor
    * @param {Color} color Color object
    * @param {Color} fontColor Color object with calculated color for font
    * @memberof module:text-colorizer.WordNode
    * @instance
    */
    setColor(color, fontColor) {
        this.color.setColor(color);
        this.$domNode.css({ "background-color": color.toString() });
        this.$domNode.css({ color: fontColor });
        this.$domNode.removeClass();
        this.$domNode.addClass("selected");
        if (color.l > 97) {
            this.$domNode.addClass("selected_white");
        }
    }
}

export default WordNode;
