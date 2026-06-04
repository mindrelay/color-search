/**
* Helper class for caret position in text editor
* @constructor
* @param {Service} $window - Angularjs $window service wrapper for window object
* @memberof module:text-colorizer
*/
class Caret {

    constructor($window) {
        this.$window = $window;
    }

    // move caret to the html node
    // @params: html node
    moveTo(node) {
        const range = this.$window.document.createRange();
        const sel = this.$window.getSelection();
        range.setStartAfter(node);
        range.setEndAfter(node);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    // move caret to special position in textnode
    moveInText(position, textNode) {
        const caret = position;
        const range = this.$window.document.createRange();
        range.setStart(textNode, caret);
        range.collapse(true);
        const sel = this.$window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }

    insertTextAtCursor(text) {
        const sel = this.$window.getSelection();
        const range = sel.getRangeAt(0);
        const node = this.$window.document.createTextNode(text);
        range.insertNode(node);
        range.setStartAfter(node);
        range.setEndAfter(node);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    insertTextNodeAtCursor(node) {
        const sel = this.$window.getSelection();
        const range = sel.getRangeAt(0);
        range.insertNode(node);
        range.setStartAfter(node);
        range.setEndAfter(node);
        sel.removeAllRanges();
        sel.addRange(range);
    }

    // https://stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022
    getCaretCharacterOffsetWithin(element) {
        let caretOffset = 0;
        const doc = element.ownerDocument || element.document;
        const win = doc.defaultView || doc.parentWindow;
        let sel;
        if (typeof win.getSelection !== "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                const range = win.getSelection().getRangeAt(0);
                const preCaretRange = range.cloneRange();
                preCaretRange.selectNodeContents(element);
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                caretOffset = preCaretRange.toString().length;
            }
        } else if ((sel = doc.selection) && sel.type != "Control") {
            const textRange = sel.createRange();
            const preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
        }
        return caretOffset;
    }
}

export default Caret;
