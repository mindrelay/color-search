import slider from 'angularjs-slider';
import './scss/color-toolbar.scss';
import template from './template/color-toolbar.html';

/**
* @module color-toolbar
* @requires module:angularjs-slider
*/
angular.module('color-toolbar', [slider])
/**
* Adjusting and vizualization of selected word color. Each color modification is 
* transfered to the main component through the 'colorModified' binding.
* The word color selection in the main component is transfered
* to the toolbar component through 'inputColor' binding.
* @member {Component} colorToolbar
* @memberof module:color-toolbar
* @property {ColorToolbarCtrl} controller
* @property {String} template
* @property {Object} bindings {colorModified: '&', onClose: '&', closed: '<', inputColor: '<'}
* @instance
*/
.component('colorToolbar', {
    template,
    bindings: {
        colorModified: '&',
        onClose: '&',
        closed: '<',
        inputColor: '<',
    },
    /**
    * Controller for 'colorToolbar' component.
    * @constructor ColorToolbarCtrl
    * @param {Service} $scope Angularjs '$scope' service
    * @param {Service} $timeout Angularjs '$timeout' service
    * @param {Service} $element Angularjs '$element' service
    * @param {Service} colorService 'colorService' service
    * @param {Factory} calculateFontColor 'calculateFontColor' factory
    * @see colorToolbar component
    * @memberof module:color-toolbar
    */
    controller: class ColorToolbarCtrl {
        static get $inject() {
            return ['$scope', '$timeout', '$element', 'colorService', 'calculateFontColor'];
        }
        constructor($scope, $timeout, $element, colorService, calculateFontColor) {
            this.$scope = $scope;
            this.$element = $element;
            this.$timeout = $timeout;
            this._colorService = colorService;
            this._calculateFontColor = calculateFontColor;
            this.wordLinking = true;
            this.colors = [];
            for (let i = 0; i < 360; i += 30) {
                const color = colorService.getColorInstance({ h: i, s: 80, l: 50 });
                this.colors.push(color);
            }
            const black = colorService.getColorInstance({ h: 0, s: 0, l: 0 }).setAchromatic();
            const white = colorService.getColorInstance({ h: 0, s: 0, l: 100 }).setAchromatic();
            this.colors.push(black);
            this.colors.push(white);
            this.color = colorService.getColorInstance();
            const self = this;
            this.slider = {
                value: 50,
                options: {
                    floor: 0,
                    ceil: 100,
                    step: 1,
                    onChange() {
                        self.colorModified({ color: self.color, linking: self.wordLinking });
                    },
                    onEnd() {
                        self.colorModified({ color: self.color, linking: self.wordLinking });
                    },
                    hidePointerLabels: true,
                    hideLimitLabels: true,
                    disabled: true,
                },
            };
        }

        $onInit() {
            if (this.closed === true) {
                this.close();
            }
        }

        $onChanges(changes) {
            const color = changes.inputColor.currentValue;
            if (color) {
                this.setCurrentColor(color);
                if (this.$element.hasClass("hide")) {
                    this.open();
                }
            }
        }

        /**
        * @method increaseWeight
        * @memberof module:color-toolbar.ColorToolbar
        * @instance
        */
        increaseWeight() {
            const self = this;
            if (this.color && this.color.isSet() && this.color.weight < 100) {
                this.color.weight ++;
                this.colorModified({ color: self.color, linking: self.wordLinking });
            }
        }

        /**
        * @method decreaseWeight
        * @memberof module:color-toolbar.ColorToolbar
        * @instance
        */
        decreaseWeight() {
            const self = this;
            if (this.color && this.color.isSet() && this.color.weight > 1) {
                self.color.weight --;
                this.colorModified({ color: self.color, linking: self.wordLinking });
            }
        }

        /**
        * @method endSlide
        * @memberof module:color-toolbar.ColorToolbar
        * @instance
        */
        endSlide() {
            const self = this;
            this.colorModified({ color: self.color, linking: self.wordLinking });
        }

        /**
        * @method linkingIconColor
        * @memberof module:color-toolbar.ColorToolbar
        * @instance
        */
        linkingIconColor() {
            return this.color.isSet() ? this._calculateFontColor(this.color) : "black";
        }

        /**
        * @method selectColor
        * @param {Object} $event Angularjs $event object
        * @memberof module:color-toolbar.ColorToolbar
        * @instance
        */
        selectColor($event) {
            const self = this;
            const target = $event.target;
            if (target.hasAttribute("data-toolbar-color") || target.parentElement.hasAttribute("data-toolbar-color")) {
                $event.stopPropagation();
                const colorElement = target.hasAttribute("data-toolbar-color") ? target : target.parentElement;
                const colorIndex = angular.element(colorElement).attr("data-toolbar-color");
                if (colorIndex && colorIndex !== "null") {
                    const color = this._colorService.getColorInstance(this.colors[colorIndex]);
                    this.changeColor(color);
                    this.slider.options.disabled = this.color.isAchromatic();
                } else {
                    this.setInitialColor();
                }
                this.colorModified({ color: self.color, linking: self.wordLinking });
            }
        }

        /**
        * @method changecolor
        * @memberof module:color-toolbar.ColorToolbar
        * @instance
        */
        changeColor(color) {
            color.weight = this.color.weight;
            if (!color.isAchromatic() && !this.color.isAchromatic()
                && this.color.s && this.color.l) {
                color.s = this.color.s;
                color.l = this.color.l;
            }
            this.color = color;
        }

        /**
        * @method setCurrentColor
        * @memberof module:color-toolbar.ColorToolbar
        * @instance
        */
        setCurrentColor(color) {
            if (color && color.isSet()) {
                this.color = color;
                this.slider.options.disabled = this.color.isAchromatic();
            } else {
                this.setInitialColor();
            }
        }

        /**
        * @method setInitialColor
        * @memberof module:color-toolbar.ColorToolbar
        * @instance
        */
        setInitialColor() {
            this.color = this._colorService.getColorInstance();
            this.slider.options.disabled = true;
        }

        /**
        * @method close
        * @memberof module:color-toolbar.ColorToolbar
        * @instance
        */
        close() {
            this.$element.addClass("hide");
            this.onClose();
        }

        /**
        * @method open
        * @memberof module:color-toolbar.ColorToolbar
        * @instance
        */
        open() {
            this.$element.removeClass("hide");
            this.$scope.$broadcast('rzSliderForceRender');
        }
    },
});

export default 'color-toolbar';

