import './scss/text-colorizer.scss';
import template from './template/text-colorizer.html';
import Words from './classes/Words';
import Caret from './classes/Caret';
import Helper from './classes/Helper';
import Parser from './classes/Parser';

/**
* @module text-colorizer
*/
angular.module('text-colorizer', [])
/** Text editor. Responsible for parsing and visualization of
* user text, words and selected colors. Text editor is fully editable.
* The text can be modificated, deleted
* or decolorized at any time. Text modifications will be applied after
* invokation of the 'inputComplete' method.
* @member {Component} textColorizer
* @property {TextColorizerCtrl} controller
* @property {String} template
* @property {Object} bindings {onWordselect: '&'}
* @memberof module:text-colorizer
* @instance
*/
.component('textColorizer', {
    template,
    bindings: {
        onWordselect: '&',
    },
    /**
    * Controller class of 'textColorizer' component
    * @constructor TextColorizerCtrl
    * @param {Service} $scope Angularjs '$scope' service
    * @param {Service} $element Angularjs '$element' service
    * @param {Service} $timeout Angularjs '$timeout' service
    * @param {Service} $window Angularjs '$window' service
    * @param {Factory} calculateFontColor 'calculateFontColor' factory
    * @param {Service} colorService 'colorService' service
    * @see textColorizer component
    * @memberof module:text-colorizer
    */
    controller: class TextColorizerCtrl {
        static get $inject() {
            return ["$scope", "$element", "$timeout", "$window", "calculateFontColor", "colorService"];
        }

        constructor($scope, $element, $timeout, $window, calculateFontColor, colorService) {
            this.$scope = $scope;
            this.$element = $element;
            this.$timeout = $timeout;
            this.$window = $window;
            this.$ = angular.element;
            this.$root = this.$($element).find('.text-colorizer__text');
            this.words = new Words(colorService, calculateFontColor);
            this.caret = new Caret($window);
            this.helper = new Helper($window, this.$, this.$root, this.caret);
            this.parser = new Parser(this.$, $window, this.$root, colorService, this.words);
            this.editMode = true;
        }

        $onInit() {
            this.switchToEditMode();
        }

        /** Exposes public api object.
        * @method _api
        * @return {Object}
        * @memberof module:text-colorizer.TextColorizer
        * @instance
        */
        _api() {
            const self = this;
            return {
                inputComplete(callback) {
                    self.inputComplete(callback);
                },
                editMode() {
                    self.switchToEditMode();
                },
                setColor(word, color, linking, callback) {
                    self.setColor(word, color, linking, callback);
                },
                resetColor(word, linking, callback) {
                    self.resetColor(word, linking, callback);
                },
                resetAllColors(callback) {
                    self.resetAllColors(callback);
                },
                getAllColors() {
                    return self.getAllColors();
                },
                setColors(colors, callback) {
                    self.setColors(colors, callback);
                },
                clear(callback) {
                    self.clear(callback);
                },
                hasColors() {
                    return self.getAllColors().size > 0;
                },
            };
        }

        /** Component hook method, which is called after linking phase.
        * Registrates $on handler in the $scope for "text-colorizer" event.
        * Returns the public api for this component as a callback parameter
        * in the event handler for "text-colorizer" event.
        * @method $postLink
        * @memberof module:text-colorizer.TextColorizer
        * @instance
        */
        $postLink() {
            this.helper.observeEditorChanges();
            this.$scope.$on("text-colorizer", (event, callback) => {
                if (typeof callback === "function") {
                    callback(this._api());
                }
            });
        }

        /** Event-handler. Handles double clicks in editor in 'edit' mode.
         * Adds spaces in editor on doubleclicks and improves usability.
        * @method handleMouseDown
        * @param {Object} $event - Angularjs $event object
        * @memberof module:text-colorizer.TextColorizer
        * @instance
        */
        handleMouseDown($event) {
            if (this.editMode) {
                if ($event.detail > 1) {
                    $event.preventDefault();
                    this.helper.doubleClick($event.originalEvent);
                }
            }
        }

        /** Event-handler. Handles 'paste' events in text editor.
         * Allows only plain text paste in text editor.
        * @function handlePaste
        * @param {Object} $event - Angularjs $event object
        * @memberof module:text-colorizer.TextColorizer
        * @instance
        */
        handlePaste($event) {
            this.helper.handlePaste($event);
        }

        /** Event-handler. Handles 'keydown' events in editor.
        * @function handleKeyDown
        * @param {Object} $event - Angularjs $event object
        * @memberof module:text-colorizer.TextColorizer
        * @instance
        */
        handleKeyDown($event) {
            this.helper.handleKeyDown($event);
        }

        /** Applies changes and detects words in text editor.
        * @function inputComplete
        * @param {Function} callback - Callback function (optional)
        * @memberof module:text-colorizer.TextColorizer
        * @instance
        */
        inputComplete(callback) {
            this.editMode = false;
            this.parser.parse();
            const currentIds = new Set();
            this.$root.find(`[data-word]`).each((i, elem) => {
                const idString = this.$(elem).attr("data-word");
                const id = parseInt(idString, 10);
                currentIds.add(id);
                const nextSibling = elem.nextSibling;
                if (nextSibling && nextSibling.nodeType !== 3) {
                    this.$(elem).after("\u00A0");
                }
            });
            const ids = this.words.getIds();
            for (const id of ids) {
                if (!currentIds.has(id)) {
                    this.words.removeWordNode(id);
                }
            }
            if (callback) {
                callback();
            }
        }

        /** Switch to 'edit' mode and move caret to the end of input text.
        * @function  switchToEditMode
        * @memberof module:text-colorizer.TextColorizer
        * @instance
        */
        switchToEditMode() {
            this.editMode = true;
            this.$root.attr("contentEditable", true);
            this.helper.removeEmptyLast(this.$root);
            const $last = this.helper.getLast(this.$root);
            const lastNodeType = ($last && $last[0]) ? $last[0].nodeType : undefined;
            if (lastNodeType === 3) {
                this.caret.moveTo($last[0]);
            } else if (lastNodeType) {
                const node = this.$window.document.createTextNode('\u00A0');
                $last.after(node);
                this.caret.moveTo(node);
            }
            this.$root[0].focus();
        }

        /** Set  color for specific word.
        * @function setColor
        * @param {Word} word Word object
        * @param {Color} color Color object
        * @param {boolean} linking Flag if the operation must be applied to all equal words
        * @param {Function} callback Callback function (optional)
        * @memberof module:text-colorizer.TextColorizer
        * @instance
        */
        setColor(word, color, linking, callback) {
            if (!this.editMode && word) {
                if (linking) {
                    this.words.setColor(word.id, color);
                } else {
                    this.words.setColorOnce(word.id, color);
                }
                if (callback) {
                    callback();
                }
            }
        }

        /** Colorize words.
        * @function setColors
        * @param {Map} wordColors HashMap with colors and words
        * @param {Function} callback Callback function (optional)
        * @memberof module:text-colorizer.TextColorizer
        * @instance
        */
        setColors(wordColors, callback) {
            this.inputComplete(() => {
                for (const [word, color] of wordColors) {
                    this.words.setColorByWord(word, color);
                }
                if (callback) {
                    callback();
                }
            });
        }

        /** Return all colors as map
        * @function getAllColors
        * @return {Map}
        * @memberof module:text-colorizer.TextColorizer
        * @instance
        */
        getAllColors() {
            return this.words.getAllWordNodes();
        }

        /** Resets one color (decolorize word).
        * @function resetColor
        * @param {Word} word Word object
        * @param {boolean} linking Flag if the operation must be applied to all equal words
        * @param {Function} callback Callback function (optional)
        * @memberof module:text-colorizer.TextColorizer
        * @instance
        */
        resetColor(word, linking, callback) {
            if (!this.editMode && word) {
                if (linking) {
                    this.words.resetColor(word.id);
                } else {
                    this.words.resetOneColor(word.id);
                }
            }
            if (callback) {
                callback();
            }
        }

        /** Resets all colors in all words (decolorize words).
        * @function resetAllColors
        * @param {Function} callback Callback function (optional)
        * @memberof module:text-colorizer.TextColorizer
        * @instance
        */
        resetAllColors(callback) {
            this.words.resetAllColors();
            if (callback) {
                callback();
            }
        }

        /** Eventhandler. Handles simple clicks on words in editor.
        * @function selectWord
        * @param {Object} $event Angularjs $event object
        * @memberof module:text-colorizer.TextColorizer
        * @instance
        */
        selectWord($event) {
            $event.stopPropagation();
            const $targetNode = this.$($event.target);
            if ($targetNode.is("[data-word]")) {
                if (!this.editMode) {
                    const id = $targetNode.attr("data-word");
                    const savedWord = this.words.getWordNode(parseInt(id, 10));
                    this.onWordselect({ word: savedWord });
                } else {
                    this.helper.clickOnWord($targetNode);
                }
            }
        }

        /** Deletes all colors and words in text editor.
        * @function clear
        * @param {Function} callback Callback function (optional)
        * @memberof module:text-colorizer.TextColorizer
        * @instance
        */
        clear(callback) {
            this.words.clear();
            this.$root.empty();
            this.switchToEditMode();
            if (callback) {
                callback();
            }
        }
    },
});

export default 'text-colorizer';
