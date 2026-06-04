import './scss/main.scss';
import template from './template/main.html';
import colorAdjuster from '../color-adjuster/color-adjuster';
import textColorizer from '../text-colorizer/text-colorizer';
import toolbar from '../color-toolbar/color-toolbar';
import imageFinder from '../image-finder/image-finder';
import settings from '../settings/settings';

/**
* @module main
* @requires module:color-adjuster
* @requires module:text-colorizer
* @requires module:color-toolbar
* @requires module:image-finder
* @requires module:settings
*/
angular.module('main', [colorAdjuster, textColorizer, toolbar, imageFinder, settings])
/** Calculates font color according to background color.
*  Uses 'colorService' for calculations.
* @member {Factory} calculateFontColor
* @memberof module:main
* @instance
*/
.factory('calculateFontColor', ['colorService', colorService => (color) => {
        const fontColor = colorService.colorWithGreaterCR(colorService.hslToRgb(color),
        { r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 });
        return colorService.rgbToHex(fontColor);
    },
])
/** Representation of 'main' page in web application.
* Contains several child components which are responsible for main functionality
* of the application. Orchestrates the collaboration of the contained components
* with the help of component bindings.
* @member {Component} main
* @memberof module:main
* @instance
*/
.component('main', {
    template,
    /**
    * Controller class of 'main' component
    * @constructor Main
    * @param {Service} $rootScope Angularjs '$rootScope' service
    * @param {Service} $scope Angularjs '$scope' service
    * @param {Service} $timeout Angularjs '$timeout'
    * @param {Service} textColors 'textColors' model / service
    * @param {Service} appSettings 'appSettings' model / service
    * @param {Service} colorService 'colorService' service
    * @param {Service} popupDialog 'popupDialog' service
    * @see main component
    * @memberof module:main
    */
    controller: class Main {

        static get $inject() {
            return ['$rootScope', '$scope', '$timeout', 'textColors', 'appSettings', 'colorService', 'popupDialog'];
        }

        constructor($rootScope, $scope, $timeout, textColors, appSettings, colorService, dialog) {
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this._colorService = colorService;
            this._dialog = dialog;
            this.textColors = textColors;
            this.appSettings = appSettings;
            this.colors = new Map();
            this.settingsOpened = false;
            this.selectedWord = {};
            this.textColorizer = null;
            this.selectedColor = null;
            this.searchData = null;
            this.resultFound = null;
        }

        /** Event-handler that handles open / close of settings component
        * @method toggleSettings
        * @memberof module:main.Main
        * @instance
        */
        toggleSettings() {
            this.settingsOpened = !this.settingsOpened;
            this.$timeout(() => {
                this.$scope.$broadcast('rzSliderForceRender');
            }, 0, false);
        }

        /** If certain color profile was selected and applied,
        *  this method will be called. Sets all colors in text-colorizer.
        * @method  loadColorProfile
        * @param {Map} colors
        * @param {Number} sPercentage
        * @param {Number} lPercentage
        * @memberof module:main.Main
        * @instance
        */
        loadColorProfile(colors, sPercentage, lPercentage) {
            const colorizer = this.getColorizer();
            colorizer.setColors(colors, () => {
                this._updateColors();
                this.textColors.update(colorizer.getAllColors(),
                sPercentage, lPercentage);
                this.$scope.$broadcast("colorsChainged");
            });
        }

        /** Handler for click on certain word in text editor.
        * @method  selectWord
        * @param {WordNode} word
        * @memberof module:main.Main
        * @instance
        */
        selectWord(word) {
            this.selectedWord = word;
        }

        /** If color was modified, this method will be called.
        * @method colorModified
        * @param {HSLColor} color
        * @param {Boolean} linking
        * @memberof module:main.Main
        * @instance
        */
        colorModified(color, linking) {
            const colorizer = this.getColorizer();
            if (color && colorizer) {
                if (color.isSet()) {
                    colorizer.setColor(this.selectedWord, color, linking, () => {
                        this.textColors.update(colorizer.getAllColors());
                        this.$scope.$broadcast("colorsChainged");
                    });
                } else {
                    colorizer.resetColor(this.selectedWord, linking, () => {
                        this.textColors.update(colorizer.getAllColors());
                        this.$scope.$broadcast("colorsChainged");
                    });
                }
                this._updateColors();
            }
        }

        /**
        * @method  inputComplete
        * @memberof module:main.Main
        * @instance
        */
        inputComplete() {
            const colorizer = this.getColorizer();
            colorizer.inputComplete(() => {
                this._updateColors();
                this.textColors.update(colorizer.getAllColors());
                this.$scope.$broadcast("colorsChainged");
            });
        }

        /** Delete all colors and words
        * @method  drop
        * @memberof module:main.Main
        * @instance
        */
        drop() {
            const colorizer = this.getColorizer();
            colorizer.clear(() => {
                this._updateColors();
                this.textColors.clear();
                this.$scope.$broadcast("colorsChainged");
            });
        }

        /** Opens confirm dialog
        * @method  dropDialog
        * @memberof module:main.Main
        * @instance
        */
        dropDialog() {
            const self = this;
            this._dialog.confirmDialog(function () {
                this.yes = () => {
                    self.drop();
                    self._dialog.close();
                };
                this.cancel = () => {
                    self._dialog.close();
                };
                this.title = '"drop"';
            });
        }

        /** Opens confirm dialog
        * @method  decolorizeDialog
        * @memberof module:main.Main
        * @instance
        */
        decolorizeDialog() {
            const self = this;
            const colors = this.textColors.colors;
            if (colors.length > 0) {
                this._dialog.confirmDialog(function () {
                    this.yes = () => {
                        self.decolorizeText();
                        self._dialog.close();
                    };
                    this.cancel = () => {
                        self._dialog.close();
                    };
                    this.title = '"clear"';
                });
            }
        }

        /** Decolorize all words
        * @method  decolorizeText
        * @memberof module:main.Main
        * @instance
        */
        decolorizeText() {
            const colorizer = this.getColorizer();
            colorizer.resetAllColors(() => {
                this._updateColors();
                this.textColors.clear();
                this.$scope.$broadcast("colorsChainged");
            });
        }

        /** Enables edit mode in text editor.
        * @method  edit
        * @memberof module:main.Main
        * @instance
        */
        edit() {
            const colorizer = this.getColorizer();
            colorizer.editMode();
        }

        /** Search for similar images.
        * @method  search
        * @memberof module:main.Main
        * @instance
        */
        search() {
            const self = this;
            const colorsAndWords = this.textColors.colorsAndWords;
            if (!this.appSettings.checkSemanticSimilarity) {
                colorsAndWords.words = [];
            }
            this.searchData = { words: colorsAndWords, settings: self.appSettings };
        }

        /** Checks if search result exists.
        * @method  imagesFound
        * @param {Image[]} images
        * @memberof module:main.Main
        * @instance
        */
        imagesFound(images) {
            this.resultFound = images.length > 0;
        }

        /** Gets text-colorizer component
        * @method  getColorizer
        * @memberof module:main.Main
        * @instance
        */
        getColorizer() {
            if (!this.textColorizer) {
                this.$scope.$broadcast("text-colorizer", (colorizer) => {
                    this.textColorizer = colorizer;
                });
            }
            return this.textColorizer;
        }

        _updateColors() {
            const colorizer = this.getColorizer();
            const cols = colorizer.getAllColors();
            this.colors.clear();
            for (const value of cols.values()) {
                const word = value.word.toLowerCase();
                const color = value.color;
                const entry = this.colors.get(word);
                if (entry) {
                    entry.add(color);
                } else {
                    const colorSet = this._colorService.getColorSetInstance();
                    colorSet.add(color);
                    this.colors.set(word, colorSet);
                }
            }
        }
    },
});

export default 'main';
