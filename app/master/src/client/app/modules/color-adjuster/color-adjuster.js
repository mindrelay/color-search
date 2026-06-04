import "chartist/dist/scss/chartist.scss";
import angularChartist from 'angular-chartist.js';
import slider from 'angularjs-slider';
import './scss/color-adjuster.scss';
import template from './template/color-adjuster.html';

/**
* @module color-adjuster
* @requires module:angularjs-slider
* @requires module:angular-chartist
*/
angular.module('color-adjuster', [slider, angularChartist])
/** Adjusting of all selected colors (saturation & lightness).
* The global distribution of selected colors is shown in the chart.
* @member {Component} colorAdjuster
* @property {ColorAdjusterCtrl} controller
* @memberof module:color-adjuster
* @instance
*/
.component('colorAdjuster', {
    template,
    /**
    * Controller for 'colorAdjuster' component.
    * @constructor ColorAdjusterCtrl
    * @param {Service} $rootScope Angularjs '$scope'
    * @param {Service} $timeout Angularjs '$timeout' service
    * @param {Service} colorService 'colorService' service
    * @param {Service} textColors 'textColors' service
    * @see colorAdjuster component
    * @memberof module:color-adjuster
    */
    controller: class ColorAdjusterCtrl {

        static get $inject() {
            return ['$scope', '$timeout', 'colorService', 'textColors'];
        }

        constructor($scope, $timeout, colorService, textColors) {
            this.$scope = $scope;
            this.$timeout = $timeout;
            this._colorService = colorService;
            this.textColors = textColors;
            this.chart = {};
            const self = this;
            this.chart.options = {
                showLabel: false,
                donut: true,
                donutWidth: 40,
                donutSolid: true,
                startAngle: 270,
            };
            this.chart.data = {};
            this.chart.events = {
                draw: (context) => {
                    if (context.type === "slice") {
                        context.element.attr({
                            style: `fill: ${context.meta}`,
                        });
                    }
                },
            };
            this.chart.responsive = [
                ['screen and (min-width: 500px)', {
                    donutWidth: 30,
                }],
            ];
            this.slider = {
                value: 50,
                options: {
                    floor: 0,
                    ceil: 200,
                    step: 1,
                    onChange: () => {
                        textColors.calculateAdjustedColors();
                        self._colorsChanged();
                    },
                    onEnd: () => {
                        textColors.calculateAdjustedColors();
                        self._colorsChanged();
                    },
                    hidePointerLabels: true,
                    hideLimitLabels: true,
                    disabled: false,
                },
            };
            this.$scope.$on("colorsChainged", this._colorsChanged.bind(this));
            this.$scope.$on("refresh", () => {
                this.chart.data = {};
                this._colorsChanged();
            });
        }

        /**
        * @method toggle
        * @memberof module:color-adjuster.ColorAdjuster
        * @instance
        */
        toggle() {
            this.$timeout(() => {
                this.$scope.$broadcast('rzSliderForceRender');
            }, 0, false);
        }

        /**
        * @method getS
        * @return {string}
        * @memberof module:color-adjuster.ColorAdjuster
        * @instance
        */
        getS() {
            return this.textColors.sPercentage < 100 ? `-${Math.abs(this.textColors.sPercentage - 100)}` :
            `+${Math.abs(this.textColors.sPercentage - 100)}`;
        }

        /**
        * @method getL
        * @return {string}
        * @memberof module:color-adjuster.ColorAdjuster
        * @instance
        */
        getL() {
            return this.textColors.lPercentage < 100 ? `-${Math.abs(this.textColors.lPercentage - 100)}` :
            `+${Math.abs(this.textColors.lPercentage - 100)}`;
        }

        _colorsChanged() {
            const tempColors = new Map();
            const data = [];
            for (const [key, color] of this.textColors.adjustedColorOccurence.entries()) {
                const keyColor = this._colorService.getColorInstance().setColorFromString(key);
                const hex = this._colorService.hslToHexString(keyColor);
                let count = tempColors.has(hex) ? tempColors.get(hex) : 0;
                count += color.weight;
                tempColors.set(hex, count);
            }
            for (const [hex, count] of tempColors) {
                data.push({ value: count, meta: hex });
            }
            this.chart.data.series = data;
        }
    },
});

export default 'color-adjuster';
