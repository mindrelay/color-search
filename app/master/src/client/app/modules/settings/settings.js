import './scss/settings.scss';
import template from './template/settings.html';

/**
* @module settings
*/
angular.module('settings', [])

/** Settings component which is responsible for visualization
* of app (search) settings.
* @member {Component} settings
* @property {SettingsCtrl} controller
* @property {String} template
* @memberof module:settings
* @instance
*/
.component('settings', {
    template,

    /**
    * Controller class of 'settings' component
    * @constructor SettingsCtrl
    * @param {Service} $scope Angularjs '$scope' service
    * @param {Service} appSettings 'appSettings' service
    * @see settings component
    * @memberof module:settings
    */
    controller: class SettingsCtrl {
        static get $inject() {
            return ['$scope', 'appSettings'];
        }
        constructor($scope, settings) {
            const self = this;
            this.$scope = $scope;
            this._settingsOldState = Object.values(settings.serialize()).join();
            this.settings = settings;
            this.similarityLevel = settings.similarityLevel;
            this.slider = {
                value: 50,
                options: {
                    floor: 50,
                    ceil: 100,
                    step: 1,
                    onChange: () => {},
                    onEnd: () => {
                        self.settings.similarityLevel = self.similarityLevel;
                    },
                    hidePointerLabels: true,
                    hideLimitLabels: true,
                    disabled: false,
                },
            };
        }

        $doCheck() {
            const state = Object.values(this.settings.serialize()).join();
            if (state !== this._settingsOldState) {
                this._settingsOldState = state;
                this.similarityLevel = this.settings.similarityLevel;
                this.settings.save(() => {
                }, (e) => {
                    console.log(e);
                });
            }
        }

        $onInit() {
            this.settings.load(() => {
                this.similarityLevel = this.settings.similarityLevel;
            }, (e) => {
                console.log(e);
            });
        }
    },
});

export default 'settings';
