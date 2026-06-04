import uirouter from '@uirouter/angularjs';
import 'angular-spinner';
import Routes from './core/routing/Routes';
import Settings from './core/models/Settings';
import ColorService from './core/models/ColorService';
import TextColors from './core/models/TextColors';
import JSONrpc from './core/services/rpc/JsonRpc';
import main from "../main/main";
import guide from "../guide/guide";
import profiles from '../profiles/profiles';
import './scss/color-search.scss';
import template from './template/color-search.html';
import Login from './core/models/Login';
import popupDialog from './core/services/dialog/dialog';
import db from './core/services/db/db';

/**
* Root module, which contains all other application modules.
* @module color-search
* @requires module:@uirouter/angularjs
* @requires module:jsonrpc
* @requires module:profiles
* @requires module:main
* @requires module:guide
* @requires module:dialog
* @requires module:db
* @requires module:angularSpinner
*/
angular.module('color-search', [uirouter, JSONrpc, profiles, main, guide, popupDialog, db, 'angularSpinner'])
.config(Routes)
.config(['$JsonRpcProvider', (provider) => {
    provider.set({ url: "/" });
}])
/** Colors model. Creates new Color objects and converts color in/from
* different color spaces.
* @member {Service} colorService
* @memberof module:color-search
* @see ColorService class
* @instance
*/
.service('colorService', ColorService)
/** Application and search settings model.
* @member {Service} appSettings
* @memberof module:color-search
* @see Settings class
* @instance
*/
.service('appSettings', ['db', Settings])
/** TextColors model, which represents words and colors selected by user.
* @member {Service} textColors
* @memberof module:color-search
* @see TextColors class
* @instance
*/
.service('textColors', ['colorService', TextColors])
/** Login model. Contains user login business logic.
* @member {Service} login
* @memberof module:color-search
* @see Login class
* @instance
*/
.service('login', ['$q', 'jsonrpc', Login])
/** Root component of the application.
* Checks on initialization if login is required.
* Contains click handlers for page navigation.
* @member {Component} colorSearch
* @property {ColorSearchCtrl} controller
* @property {String} template
* @memberof module:color-search
* @instance
*/
.component('colorSearch', {
    template,
    /**
    * Controller for 'colorSearch' component.
    * @constructor ColorSearch
    * @param {Service} $rootScope Angularjs '$rootScope' service
    * @param {Service} $timeout Angularjs '$timeout' service
    * @param {Service} $transitions Angularjs UI Router '$transitions' service
    * @param {Service} $state Angularjs UI Router '$state' service
    * @param {Service} login 'login' service
    * @param {Service} popupDialog 'popupDialog' service from 'dialog' module
    * @see colorSearch component
    * @memberof module:color-search
    */
    controller: class ColorSearchCtrl {
        static get $inject() {
            return ['$rootScope', '$timeout', '$window', '$transitions', '$state', 'login', 'popupDialog'];
        }

        constructor($rootScope, $timeout, $window, $transitions, $state, login, dialog) {
            this.$rootScope = $rootScope;
            this.$timeout = $timeout;
            this.$window = $window;
            this.$state = $state;
            this._login = login;
            this._dialog = dialog;
            this.page = "main";

            $transitions.onSuccess({}, (transition) => {
                const data = transition.to().data;
                this.page = data["page"];
                $timeout(() => {
                   $rootScope.$broadcast('rzSliderForceRender');
                   $rootScope.$broadcast('refresh');
                }, 0, false);
            });
        }

        $onInit() {
            angular.element(this.$window).bind('resize orientationchange', () => {
                this.$timeout(() => {
                    this.$rootScope.$broadcast('rzSliderForceRender');
                    this.$rootScope.$broadcast('refresh');
                });
            });
        }

        $postLink() {
            this._login.isRequired()
            .then((required) => {
                if (required) {
                    this.openLoginDialog();
                }
            }).catch((err) => {
                console.log(err);
                const self = this;
                this._dialog.errorDialog(function () {
                    this.title = "Connection error";
                    this.description = "Try to reload the application.";
                    this.buttonTitle = "Reload";
                    this.button = true;
                    this.icon = 'refresh';
                    this.handle = () => {
                        self.$window.location.reload(true);
                    };
                });
            });
        }

        /** Navigate to settings page.
        * @method goToSettings
        * @memberof module:color-search.ColorSearch
        * @instance
        */
        goToSettings() {
            this.page = "profiles";
            this.$state.go('main.profiles');
        }

        /** Navigate to guide page.
        * @method goToGuide
        * @memberof module:color-search.ColorSearch
        * @instance
        */
        goToGuide() {
            this.page = "guide";
            this.$state.go('main.guide');
        }

        /** Navigate to main page.
        * @method goToMain
        * @memberof module:color-search.ColorSearch
        * @instance
        */
        goToMain() {
            this.page = "main";
            this.$state.go('main');
        }

        /** Open login dialog.
        * @method openLoginDialog
        * @memberof module:color-search.ColorSearch
        * @instance
        */
        openLoginDialog() {
            const self = this;
            this._dialog.loginDialog(function () {
                this.model = self._login;
                this.login = () => {
                    if (this.model.isSet()) {
                        this.model.login()
                        .then((succ) => {
                            if (succ) {
                                self._dialog.close();
                            }
                        });
                    }
                };
            });
        }
    },
});

export default 'color-search';
