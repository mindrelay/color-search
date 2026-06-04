export default class Helper {

    constructor($window, $, root, caret) {
        this.$window = $window;
        this.root = root;
        this.$ = $;
        this.caret = caret;
    }

    handleKeyDown(event) {
        // prevents "enter" within detected words
        const anchorNode = this.$window.getSelection().anchorNode;
        const target = (anchorNode && anchorNode.parentNode) ? anchorNode.parentNode : null;
        if (event.keyCode === 13 && this.$(target).is("[data-word]")) {
            event.preventDefault();
        }
    }

    // workaround for webkit / chrome
    // https://stackoverflow.com/questions/19243432/prevent-contenteditable-mode-from-creating-span-tags
    // https://github.com/yabwe/medium-editor/issues/543
    observeEditorChanges() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const editable = (this.root.attr("contentEditable") === "true");
                if (mutation.type === "childList" && editable) {
                    const nodes = mutation.addedNodes;
                    for (const node of nodes) {
                        if ((node.nodeName === "FONT") ||
                            (node.nodeName === "SPAN" && node.parentNode &&
                            node.parentNode.nodeName !== "FONT")) {
                                this.replaceElementWithTextContent(node);
                        }
                    }
                }
            });
        });
       const config = { childList: true };
       observer.observe(this.root[0], config);
    }

    replaceElementWithTextContent(node) {
        const $elem = this.$(node);
        const text = $elem.text();
        const textNode = this.$window.document.createTextNode(text);
        $elem.replaceWith(textNode);
        const anchor = this.$window.getSelection().anchorNode;
        if (anchor && anchor.nodeType === 3) {
            this.caret.moveTo(textNode);
        }
    }

    doubleClick(event) {
        const sel = this.$window.getSelection();
        const anchorNode = sel.anchorNode;
        let wordNode = null;
        if (this.$(anchorNode).is("[data-word]")) {
            wordNode = anchorNode;
        } else if (this.$(anchorNode.parentNode).is("[data-word]")) {
            wordNode = anchorNode.parentNode;
        } else if (this.$(event.target).is("[data-word]")) {
            wordNode = event.target;
        }
        const spaceNode = this.$window.document.createTextNode('\u00A0');
        if (!wordNode) {
            this.caret.insertTextNodeAtCursor(spaceNode);
            this.caret.moveTo(spaceNode);
        } else if (wordNode && !this.$(anchorNode).is(this.root)) {
            const position = this.caret.getCaretCharacterOffsetWithin(wordNode);
            const text = this.$(wordNode).text();
            if (position === text.length) {
                this.$(wordNode).after(spaceNode);
                this.caret.moveTo(spaceNode);
            } else if (position === 0) {
                this.$(wordNode).before(spaceNode);
                this.caret.moveTo(spaceNode);
            }
        }
    }

    handlePaste(e) {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target;
        if (this.$(target).is("[data-word]")) {
            return;
        }
        let text = '';
        if (e.clipboardData || e.originalEvent.clipboardData) {
            text = (e.originalEvent || e).clipboardData.getData('Text');
        } else if (this.$window.clipboardData) {
            text = this.$window.clipboardData.getData('Text');
        }
        if (this.$window.document.queryCommandSupported('insertText')) {
            this.$window.document.execCommand('insertText', false, text);
        } else {
            this.$window.document.execCommand('paste', false, text);
        }
    }

    clickOnWord($node) {
        // for better handling in webkit
        const textNode = $node.contents().first()[0];
        const anchorNode = this.$window.getSelection().anchorNode;
        const position = this.caret.getCaretCharacterOffsetWithin(textNode);
        if (anchorNode && position === 0) {
            const text = $node.text().trim();
            if (text.length > 0) {
                const spacedText = this.$window.document.createTextNode(`\u00A0${text}`);
                this.$(textNode).replaceWith(spacedText);
                this.caret.moveInText(1, spacedText);
            }
        }
    }

    getLast($node) {
        const $last = $node.contents().last();
        const $prev = $node;
        if ($last[0] && ($last[0].nodeType === 3 || $last[0].hasAttribute("data-word"))) {
            return $last;
        } else if (!$last[0]) {
            return $prev;
        }
        return this.getLast($last);
    }

    removeEmptyLast($node) {
        const $last = $node.contents().last();
        let remove = false;
        if ($last.is("br")) {
            remove = true;
        } else if ($last[0] && $last[0].nodeType === 3) {
            const value = $last[0].nodeValue.trim();
            if (value.length < 1) {
                remove = true;
            }
        }
        if (remove) {
            $last.remove();
            this.removeEmptyLast(this.root);
        }
    }
}
