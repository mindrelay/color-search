webpackJsonp([0],[
/* 0 */
/***/ (function(module, exports) {

module.exports = angular;

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* Represents color Profile
* @constructor
* @param {String} name Name of the profile
* @param {Map} colors Colors
* @param {Number} sPercentage Saturation global setting
* @param {Number} lPercentage Lightness global setting
* @memberof module:profiles
*/

class ColorProfile {

    constructor(name, colors, sPercentage, lPercentage) {
        this.name = name;
        this.colors = colors;
        this.sPercentage = sPercentage;
        this.lPercentage = lPercentage;
    }

    countWords() {
        return this.colors.size;
    }

    getColor(word) {
        return this.colors.get(word);
    }

    deleteWord(word) {
        this.colors.delete(word);
    }

    static deserialize(o, colorService) {
        const colors = new Map(o.colors);
        for (const [word, color] of colors) {
            colors.set(word, colorService.getColorInstance(color));
        }
        const sPercentage = Math.round(parseFloat(o.sPercentage));
        const lPercentage = Math.round(parseFloat(o.lPercentage));
        return new ColorProfile(o.name, colors, sPercentage, lPercentage);
    }

    serialize() {
        const self = this;
        const o = {};
        o.name = this.name;
        o.colors = [...self.colors];
        o.sPercentage = this.sPercentage;
        o.lPercentage = this.lPercentage;
        return o;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (ColorProfile);


/***/ }),
/* 4 */,
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__assets_scss_styles_scss__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__assets_scss_styles_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__assets_scss_styles_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__modules_color_search_color_search__ = __webpack_require__(8);



angular.module('app', [__WEBPACK_IMPORTED_MODULE_1__modules_color_search_color_search__["a" /* default */]]);


/***/ }),
/* 6 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__uirouter_angularjs__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__uirouter_angularjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__uirouter_angularjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_spinner__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_spinner___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular_spinner__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__core_routing_Routes__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__core_models_Settings__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__core_models_ColorService__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__core_models_TextColors__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__core_services_rpc_JsonRpc__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__main_main__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__guide_guide__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__profiles_profiles__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__scss_color_search_scss__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__scss_color_search_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__scss_color_search_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__template_color_search_html__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__template_color_search_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__template_color_search_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__core_models_Login__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__core_services_dialog_dialog__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__core_services_db_db__ = __webpack_require__(81);
















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
angular.module('color-search', [__WEBPACK_IMPORTED_MODULE_0__uirouter_angularjs___default.a, __WEBPACK_IMPORTED_MODULE_6__core_services_rpc_JsonRpc__["a" /* default */], __WEBPACK_IMPORTED_MODULE_9__profiles_profiles__["a" /* default */], __WEBPACK_IMPORTED_MODULE_7__main_main__["a" /* default */], __WEBPACK_IMPORTED_MODULE_8__guide_guide__["a" /* default */], __WEBPACK_IMPORTED_MODULE_13__core_services_dialog_dialog__["a" /* default */], __WEBPACK_IMPORTED_MODULE_14__core_services_db_db__["a" /* default */], 'angularSpinner'])
.config(__WEBPACK_IMPORTED_MODULE_2__core_routing_Routes__["a" /* default */])
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
.service('colorService', __WEBPACK_IMPORTED_MODULE_4__core_models_ColorService__["a" /* default */])
/** Application and search settings model.
* @member {Service} appSettings
* @memberof module:color-search
* @see Settings class
* @instance
*/
.service('appSettings', ['db', __WEBPACK_IMPORTED_MODULE_3__core_models_Settings__["a" /* default */]])
/** TextColors model, which represents words and colors selected by user.
* @member {Service} textColors
* @memberof module:color-search
* @see TextColors class
* @instance
*/
.service('textColors', ['colorService', __WEBPACK_IMPORTED_MODULE_5__core_models_TextColors__["a" /* default */]])
/** Login model. Contains user login business logic.
* @member {Service} login
* @memberof module:color-search
* @see Login class
* @instance
*/
.service('login', ['$q', 'jsonrpc', __WEBPACK_IMPORTED_MODULE_12__core_models_Login__["a" /* default */]])
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
    template: __WEBPACK_IMPORTED_MODULE_11__template_color_search_html___default.a,
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

/* harmony default export */ __webpack_exports__["a"] = ('color-search');


/***/ }),
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* Routes to pages
* @constructor
* @param {$stateProvider} $stateProvider UI router '$stateProvider'
* @param {$urlRouterProvider} $urlRouterProvider UI router '$urlRouterProvider'
* @memberof module:color-search
*/
function Routes($stateProvider, $urlRouterProvider) {
    const mainState = {
        name: 'main',
        url: '/main',
        data: { page: "main" },
    };

    const settingsState = {
        name: 'main.profiles',
        url: '^/profiles',
        data: { page: "profiles" },
    };

    const guideState = {
        name: 'main.guide',
        url: '^/guide',
        data: { page: "guide" },
    };

    $stateProvider.state(mainState);
    $stateProvider.state(settingsState);
    $stateProvider.state(guideState);
    $urlRouterProvider.otherwise('/main');
}

Routes.$inject = ['$stateProvider', '$urlRouterProvider'];
/* harmony default export */ __webpack_exports__["a"] = (Routes);



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* Data Access Object for Settings model.
* Used for saving and loading of application & search setttings
* in client database.
* @constructor:
* @param {Service} db 'db' service
* @memberof module:color-search
*/
class SettingsDAO {

    constructor(db) {
        this.store = "settings";
        this.db = db;
    }

    /** Load settings from client database.
    * @method loadSettings
    * @param {Settings} settings Settings model
    * @param {function} succ Callback on success
    * @param {function} err Callback on error
    * @memberof module:color-search.SettingsDAO
    * @instance
    */
    loadSettings(settings, succ, err) {
        this.db.getStore(this.store)
        .getItem('settings')
        .then((item) => {
            settings.deserialize(item);
            if (succ) {
                succ();
            }
        })
        .catch((e) => {
            console.warn(e);
            if (err) {
                err();
            }
        });
    }

    /** Save settings in client database.
    * @method saveSettings
    * @param {Settings} settings Settings model
    * @param {function} succ Callback on success
    * @param {function} err Callback on error
    * @memberof module:color-search.SettingsDAO
    * @instance
    */
    saveSettings(settings, succ, err) {
        this.db.getStore(this.store)
        .setItem('settings', settings.serialize())
        .then(() => {
            if (succ) {
                succ();
            }
        })
        .catch((e) => {
            console.warn(e);
            if (err) {
                err();
            }
        });
    }
}

/**
* Application & search settings model.
* @constructor:
* @param {Service} db 'db' service
* @memberof module:color-search
*/
class Settings {

    constructor(db) {
        this.module = 'settings';
        this.dao = new SettingsDAO(db);
        this.checkSemanticSimilarity = false;
        this.searchMode = 'regular';
        this.similarityLevel = 85;
        this.distance = 'euclidean';
        this.supportedDistances = [
            { id: 'euclidean', name: 'Euclidean' },
            { id: 'chisquare', name: 'Chi-Square' },
            { id: 's2jsd', name: 'S2JSD' }];
    }

    /** Load settings from database.
    * @method load
    * @memberof module:color-search.Settings
    * @instance
    */
    load(succ, err) {
        this.dao.loadSettings(this, succ, err);
    }

    /** Save current settings in database.
    * @method save
    * @memberof module:color-search.Settings
    * @instance
    */
    save(succ, err) {
        this.dao.saveSettings(this, succ, err);
    }

    /** Creates JSON (object literal)
    * @method serialize
    * @memberof module:color-search.Settings
    * @instance
    */
    serialize() {
        const o = {};
        o.module = 'settings';
        o.checkSemanticSimilarity = this.checkSemanticSimilarity;
        o.searchMode = this.searchMode;
        o.similarityLevel = this.similarityLevel;
        o.distance = this.distance;
        o.distanceMode = this.distanceMode;
        return o;
    }

    /** Deserialite settings from database object.
    * @method deserialize
    * @param {Object} dto Object from client database.
    * @memberof module:color-search.Settings
    * @instance
    */
    deserialize(dto) {
        if (dto) {
            this.editorFontSize = dto.editorFontSize;
            this.checkSemanticSimilarity = dto.checkSemanticSimilarity;
            this.searchMode = dto.searchMode;
            this.similarityLevel = dto.similarityLevel;
            this.distance = dto.distance;
        } else {
            console.warn("Settings not loaded");
        }
    }

    /** Get search settings.
    * @method getSearchSettings
    * @return {Object}
    * @memberof module:color-search.Settings
    * @instance
    */
    getSearchSettings() {
        const o = {};
        o.checkSemanticSimilarity = this.checkSemanticSimilarity;
        o.searchMode = this.searchMode;
        o.similarityLevel = this.similarityLevel;
        o.distance = this.distance;
        o.distanceMode = this.distanceMode;
        return o;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Settings);


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_colr__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_colr___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_colr__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__HSLColor__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ColorSet__ = __webpack_require__(18);




/**
* Color manager class. Creates color objects and converts colors
* in different color spaces and formats.
* @constructor:
* @memberof module:color-search
*/
class ColorService {

    /** Creates new HSLColor instance.
    * @method getColorInstance
    * @return {HSLColor}
    * @memberof module:color-search.ColorService
    * @instance
    */
    getColorInstance(o) {
        return new __WEBPACK_IMPORTED_MODULE_1__HSLColor__["a" /* default */](o);
    }

    /** Creates new ColorSet instance.
    * @method getColorSetInstance
    * @return {ColorSet}
    * @memberof module:color-search.ColorService
    * @instance
    */
    getColorSetInstance() {
        return new __WEBPACK_IMPORTED_MODULE_2__ColorSet__["a" /* default */]();
    }

    /** Converts hsl object into hex string color representation.
    * @method hslToHexString
    * @param {Object} color Object with h,s,l values
    * @return {string}
    * @memberof module:color-search.ColorService
    * @instance
    */
    hslToHexString(color) {
        return __WEBPACK_IMPORTED_MODULE_0_colr___default.a.fromHsl(color.h, color.s, color.l).toHex();
    }

    /** Converts hex string color into HSL object.
    * @method hexToHsl
    * @param {string} hex Hex-string
    * @return {HSLColor}
    * @memberof module:color-search.ColorService
    * @instance
    */
    hexToHsl(hex) {
        return __WEBPACK_IMPORTED_MODULE_0_colr___default.a.fromHex(hex).toHsl();
    }

    /** Converts HSL object into HSL string
    * @method toString
    * @return {string}
    * @memberof module:color-search.ColorService
    * @instance
    */
    hslToHslString(color) {
        return `hsl(${color.h},${color.s}%,${color.l}%)`;
    }

    /** Converts HSL object into RGB object.
    * @method hslToRgb
    * @return {Object} Object with r,g,b values
    * @memberof module:color-search.ColorService
    * @instance
    */
    hslToRgb(color) {
        return __WEBPACK_IMPORTED_MODULE_0_colr___default.a.fromHslObject(color).toRgbObject();
    }

    /** Converts RGB object into hex string.
    * @method rgbToHex
    * @param {Object} color Object with r,g,b values.
    * @return {string}
    * @memberof module:color-search.ColorService
    * @instance
    */
    rgbToHex(color) {
        return __WEBPACK_IMPORTED_MODULE_0_colr___default.a.fromRgbObject(color).toHex();
    }

    /** Return color with greater CR value.
    * @method colorWithGreaterCR
    * @param {Object} rgbColor Object with r,g,b values.
    * @param {Object[]} rgbColors Objects, each with r,g,b, values.
    * @return {Object} Object with r,g,b values.
    * @memberof module:color-search.ColorService
    * @instance
    */
    colorWithGreaterCR(rgbColor, ...rgbColors) {
        let cTemp = rgbColor;
        if (rgbColors && rgbColors.length > 0) {
            cTemp = rgbColors[0];
            let crTemp = this.cr(rgbColor, rgbColors[0]);
            for (let i = 0; i < rgbColors.length; i++) {
                const cr = this.cr(rgbColor, rgbColors[i]);
                if (crTemp < cr) {
                    crTemp = cr;
                    cTemp = rgbColors[i];
                }
            }
        }
        return cTemp;
    }

    /** Calculate CR value for two given RGB color objects.
    * Uses W3C recommended algorithm.
    * @method cr
    * @param {Object} c1 Object with r,g,b values.
    * @param {Object} c2 Objects, each with r,g,b, values.
    * @return {number}
    * @memberof module:color-search.ColorService
    * @instance
    */
    cr(c1, c2) {
        let lum1 = this._luminanceRGB(c1.r, c1.g, c1.b);
        let lum2 = this._luminanceRGB(c2.r, c2.g, c2.b);
        if (lum2 > lum1) {
            [lum1, lum2] = [lum2, lum1];
        }
        return (lum1 + 0.05) / (lum2 + 0.05);
    }

    _luminanceRGB(r, g, b) {
        const RsRGB = r / 255;
        const GsRGB = g / 255;
        const BsRGB = b / 255;
        const R = (RsRGB <= 0.03928) ? RsRGB / 12.92 : Math.pow(((RsRGB + 0.055) / 1.055), 2.4);
        const G = (GsRGB <= 0.03928) ? GsRGB / 12.92 : Math.pow(((GsRGB + 0.055) / 1.055), 2.4);
        const B = (BsRGB <= 0.03928) ? BsRGB / 12.92 : Math.pow(((BsRGB + 0.055) / 1.055), 2.4);
        return 0.2126 * R + 0.7152 * G + 0.0722 * B;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (ColorService);



/***/ }),
/* 15 */,
/* 16 */,
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* Represents HSL color object.
* @constructor
* @param {Object} o (optional) Configuration object with values in format
* {h: number, s: number, l: number, achromatic: boolean, weight: number}.
* @property {Number} h
* @property {Number} s
* @property {Number} l
* @property {Number} weight
* @property {Boolean} achromatic
* @memberof module:color-search
*/
class HSLColor {

    constructor(o) {
        this.weight = 1;
        this.h = undefined;
        this.s = undefined;
        this.l = undefined;
        this.achromatic = false;

        if (o && o["h"] !== undefined && o["s"] !== undefined && o["l"] !== undefined) {
            this.h = parseInt(o["h"], 10);
            this.s = parseInt(o["s"], 10);
            this.l = parseInt(o["l"], 10);
        }

        if (o && o["weight"]) {
            this.weight = parseInt(o["weight"], 10);
        }

        if (o && typeof o["achromatic"] === "boolean") {
            this.achromatic = o["achromatic"];
        }
    }

    /** Return HSL color string in format hsl(h,s%,l%).
    * @method toString
    * @return {string}
    * @memberof module:color-search.HSLColor
    * @instance
    */
    toString() {
        if (this.isSet) {
            return `hsl(${this.h},${this.s}%,${this.l}%)`;
        }
        return undefined;
    }

    /** Return unique HSL color string with weight.
    * @method toIdString
    * @return {string}
    * @memberof module:color-search.HSLColor
    * @instance
    */
    toIdString() {
        return `hsl(${this.h},${this.s}%,${this.l}%)${this.weight}`;
    }

    /** Check if color values are set.
    * @method isSet
    * @return {boolean}
    * @memberof module:color-search.HSLColor
    * @instance
    */
    isSet() {
        return (this.h !== undefined && this.s !== undefined && this.l !== undefined);
    }

    /** Set hue
    * @method setH
    * @param {number} h Hue
    * @memberof module:color-search.HSLColor
    * @instance
    */
    setH(h) {
       this.h = this.achromatic === true ? 0 : parseInt(h, 10);
       return this;
    }

    /** Set saturation
    * @method setS
    * @param {number} s Saturation
    * @memberof module:color-search.HSLColor
    * @instance
    */
    setS(s) {
       this.s = this.achromatic === true ? 0 : parseInt(s, 10);
       return this;
    }

    /** Set lightness
    * @method setL
    * @param {number} l Lightness
    * @memberof module:color-search.HSLColor
    * @instance
    */
    setL(l) {
       this.l = parseInt(l, 10);
       return this;
    }

     /** Set weight
    * @method setWeight
    * @param {number} w Weight
    * @memberof module:color-search.HSLColor
    * @instance
    */
    setWeight(w) {
        this.weight = parseInt(w, 10);
        return this;
    }

    /** Set current color to achromatic.
    * Hue and saturation values will be set to 0.
    * @method setAchromatic
    * @memberof module:color-search.HSLColor
    * @instance
    */
    setAchromatic() {
        this.h = 0;
        this.s = 0;
        this.achromatic = true;
        return this;
    }

    /** Checks if current color is achromatic.
    * @method isAchromatic
    * @return {boolean}
    * @memberof module:color-search.HSLColor
    * @instance
    */
    isAchromatic() {
        return this.achromatic;
    }

    /** Set color values from given object.
    * @method setColor
    * @param {Object} o Configuration object
    * @memberof module:color-search.HSLColor
    * @instance
    */
    setColor(o) {
        if (o && typeof o["achromatic"] === "boolean") {
            this.achromatic = o["achromatic"];
        }

        if (o["h"] !== undefined && o["s"] !== undefined && o["l"] !== undefined) {
            this.setH(o["h"]);
            this.setS(o["s"]);
            this.setL(o["l"]);
        }

        if (o["weight"]) {
            this.setWeight(o["weight"]);
        }
        return this;
    }

    setColorFromString(str) {
        const r = /^hsl\(\d+(\.\d+)?,\d+(\.\d+)?%?,\d+(\.\d+)?%?\)$/i;
        if (str && r.test(str)) {
            const re = /\d+(\.\d+)?/g;
            this.h = parseInt(re.exec(str)[0], 10);
            this.s = parseInt(re.exec(str)[0], 10);
            this.l = parseInt(re.exec(str)[0], 10);
        }
        return this;
    }

    /** Interpolate saturation. Uses linear interpolation.
    * @method interpolateS
    * @param {number} percentage Number from -100 to +100
    * @memberof module:color-search.HSLColor
    * @instance
    */
    interpolateS(percentage) {
        this.setS(this._interpolate(this.s, percentage));
        return this;
    }

    /** Interpolate lightness. Uses linear interpolation.
    * @method interpolateL
    * @param {number} percentage Number from -100 to +100
    * @memberof module:color-search.HSLColor
    * @instance
    */
    interpolateL(percentage) {
        this.setL(this._interpolate(this.l, percentage));
        return this;
    }

    // linear interpolation
    _interpolate(x, xPercentage) {
       const a = (xPercentage <= 100) ? xPercentage / 100 : (xPercentage - 100) / 100;
       return (xPercentage <= 100) ? x * a : x * (1 - a) + 100 * a;
    }

    /** Set all values to init values.
    * @method reset
    * @memberof module:color-search.HSLColor
    * @instance
    */
    reset() {
      this.h = undefined;
      this.s = undefined;
      this.l = undefined;
      this.weight = 1;
      this.achromatic = false;
      return this;
    }

    /** Return object in JSON (object literal) format.
    * @method toJSON
    * @return {Object}
    * @memberof module:color-search.HSLColor
    * @instance
    */
    toJSON() {
        const o = {};
        o.achromatic = this.achromatic;
        o.l = this.l;
        o.s = this.s;
        o.h = this.h;
        o.weight = this.weight;
        return o;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (HSLColor);


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* Iterable ColorSet for colors.
* @constructor:
* @memberof module:color-search
*/
class ColorSet {

    constructor() {
        this.map = new Map();
        this[Symbol.iterator] = this.values;
    }

    /** Add color to ColorSet.
    * @method add
    * @param {HSLColor} color
    * @memberof module:color-search.ColorSet
    * @instance
    */
    add(color) {
        this.map.set(color.toIdString(), color);
    }

    /** Get Iterator for color values
    * @method values
    * @return {Iterator<HSLColor>}
    * @memberof module:color-search.ColorSet
    * @instance
    */
    values() {
        return this.map.values();
    }

    /** Get Array of colors
    * @method getValuesArray
    * @return {HSLColor[]}
    * @memberof module:color-search.ColorSet
    * @instance
    */
    getValuesArray() {
        return [...this.map.values()];
    }

    /** Size of ColorSet
    * @method size
    * @return {number}
    * @memberof module:color-search.ColorSet
    * @instance
    */
    size() {
        return this.map.size;
    }
}

/* harmony default export */ __webpack_exports__["a"] = (ColorSet);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* TextColors model. Manages user selected words and colors.
* @constructor:
* @param {Service} colorService 'colorService' service
* @memberof module:color-search
*/
class TextColors {

    constructor(colorService) {
        this._words = [];
        this._sPercentage = 100;
        this._lPercentage = 100;
        this._colorService = colorService;
        this.colorOccurence = new Map();
        this.adjustedColorOccurence = new Map();
    }

    /** Getter for user selected words.
    * @method words
    * @return {string[]}
    * @memberof module:color-search.TextColors
    * @instance
    */
    get words() {
        return this._words;
    }

    /** Getter for user selected colors.
    * @method colors
    * @return {HSLColor[]}
    * @memberof module:color-search.TextColors
    * @instance
    */
    get colors() {
        return [...this.adjustedColorOccurence.values()];
    }

    /** Getter for user selected colors & words
    * @method colorsAndWords
    * @return {Object} Object in form {colors: Map, words: string[]}.
    * @memberof module:color-search.TextColors
    * @instance
    */
    get colorsAndWords() {
        const o = {};
        o.colors = this.colors;
        o.words = this.words;
        return o;
    }

    /** Getter for global saturation percentage
    * @method sPercentage
    * @return {number}
    * @memberof module:color-search.TextColors
    * @instance
    */
    get sPercentage() {
        return this._sPercentage;
    }

    /** Getter for global lightness percentage
    * @method lPercentage
    * @return {number}
    * @memberof module:color-search.TextColors
    * @instance
    */
    get lPercentage() {
        return this._lPercentage;
    }

    /** Setter for global saturation percentage
    * @method sPercentage
    * @param {number} sPercentage
    * @memberof module:color-search.TextColors
    * @instance
    */
    set sPercentage(sPercentage) {
        this._sPercentage = sPercentage;
        this.calculateAdjustedColors();
    }

    /** Setter for global lightness percentage
    * @method lPercentage
    * @param {number} lPercentage
    * @memberof module:color-search.TextColors
    * @instance
    */
    set lPercentage(lPercentage) {
        this._lPercentage = lPercentage;
        this.calculateAdjustedColors();
    }

    /** Setter for global saturation & lightness percentage
    * @method setSLPercentage
    * @param {number} sPercentage
    * @param {number} lPercentage
    * @memberof module:color-search.TextColors
    * @instance
    */
    setSLPercentage(sPercentage, lPercentage) {
        this._sPercentage = sPercentage;
        this._lPercentage = lPercentage;
        this.calculateAdjustedColors();
    }

    /** Delete all colors & words
    * @method clear
    * @memberof module:color-search.TextColors
    * @instance
    */
    clear() {
        this._words.length = 0;
        this.colorOccurence.clear();
        this.adjustedColorOccurence.clear();
    }

    /** Update all colors.
    * @method update
    * @param {Map} colors Hashmap with selected colors
    * @param {number} sPercentage Global saturation percentage setting (-100 to + 100).
    * @param {number} lPercentageGlobal Global lightness percentage setting (-100 to +100).
    * @memberof module:color-search.TextColors
    * @instance
    */
    update(colors, sPercentage, lPercentage) {
        this.clear();
        if (colors && colors.size > 0) {
            for (const [key, value] of colors.entries()) {
                if (value.color && value.color.isSet()) {
                    this._words.push(value.word);
                    let color = this.colorOccurence.get(value.color.toString());
                    if (color) {
                        color.setWeight(color.weight + value.color.weight);
                    } else {
                        color = this._colorService.getColorInstance(value.color);
                        this.colorOccurence.set(color.toString(), color);
                    }
                }
            }
        }
        this.sPercentage = typeof sPercentage === "number" ? sPercentage : this.sPercentage;
        this.lPercentage = typeof lPercentage === "number" ? lPercentage : this.lPercentage;
        this.calculateAdjustedColors();
    }

    /** Recalculate all colors using global sPercentage & lPercentage (interpolation used).
    * @method calculateAdjustedColors
    * @memberof module:color-search.TextColors
    * @instance
    */
    calculateAdjustedColors() {
        this.adjustedColorOccurence.clear();
        for (const value of this.colorOccurence.values()) {
            const color = this._colorService.getColorInstance(value);
            color.interpolateS(this.sPercentage).interpolateL(this.lPercentage);
            if (value.isAchromatic()) {
                color.setAchromatic();
            }
            this.adjustedColorOccurence.set(color.toString(), color);
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (TextColors);


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class JsonRpcException {
    constructor(error) {
        this.name = "jsonRpcException";
        this.message = error;
    }
}

/**
* Connects with server using AJAX and sends
* requests in JSON-RPC 2.0 message format.
* @module jsonrpc
*/
angular.module('jsonrpc', [])
.provider('$JsonRpc', function () {
    let url = "";
    this.set = (conf) => {
        url = conf["url"];
    };
    this.$get = () => ({
        url,
    });
})
/** Service for JSON-RPC 2.0 requests.
* @member {Service} jsonrpc
* @memberof module:jsonrpc
* @instance
*/
.service("jsonrpc", ["$q", "$http", "$JsonRpc", function ($q, $http, jsonrpcConfig) {
    const _url = jsonrpcConfig.url;
    if (!_url) {
        throw new JsonRpcException('Please configure server url');
    }
    let _id = 0;
    this.request = (method, params) => {
        const deferred = $q.defer();
        const req = {
            method: 'POST',
            url: _url,
            headers: { 'Content-Type': 'application/json' },
            data: _getInputData(method, params),
        };

        $http(req).then((res) => {
            const data = res.data;
            if (!res || !data) {
                deferred.reject(new JsonRpcException("Unknown Error occured. No data received"));
            } else if (data && data.result !== undefined) {
                if (!_inspectDataFormat(data)) {
                    deferred.reject(new JsonRpcException("JSON-RPC 2.0 data format must be used."));
                } else {
                    deferred.resolve(data.result);
                }
            } else {
                console.log(data);
                deferred.reject(new JsonRpcException(`No data received. HTTP status code: ${data.error.status}`));
            }
        }, (error) => {
            if (error) {
                deferred.reject(new JsonRpcException(`Error occured. HTTP status code: ${error.status}`));
            } else {
            deferred.reject(new JsonRpcException("Unknown Error occurred"));
            }
        });
        return deferred.promise;
    };

    function _getInputData(methodName, args) {
    _id += 1;
        return {
            jsonrpc: '2.0',
            id: _id,
            method: methodName,
            params: args,
        };
    }

    function _inspectDataFormat(data) {
        const allowedKeys = ["jsonrpc", "id", "result"];
        const keys = Object.keys(data);
        let ret = false;
        if (keys.length === allowedKeys.length) {
            ret = true;
            keys.forEach((key) => {
                if (allowedKeys.indexOf(key) < 0) {
                    ret = false;
                }
                if (key === "jsonrpc" && data[key] !== "2.0") {
                    ret = false;
                }
            });
        }
        return ret;
    }
}]);


/* harmony default export */ __webpack_exports__["a"] = ('jsonrpc');


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_main_scss__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__scss_main_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_main_html__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_main_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__template_main_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__color_adjuster_color_adjuster__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__text_colorizer_text_colorizer__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__color_toolbar_color_toolbar__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__image_finder_image_finder__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__settings_settings__ = __webpack_require__(54);








/**
* @module main
* @requires module:color-adjuster
* @requires module:text-colorizer
* @requires module:color-toolbar
* @requires module:image-finder
* @requires module:settings
*/
angular.module('main', [__WEBPACK_IMPORTED_MODULE_2__color_adjuster_color_adjuster__["a" /* default */], __WEBPACK_IMPORTED_MODULE_3__text_colorizer_text_colorizer__["a" /* default */], __WEBPACK_IMPORTED_MODULE_4__color_toolbar_color_toolbar__["a" /* default */], __WEBPACK_IMPORTED_MODULE_5__image_finder_image_finder__["a" /* default */], __WEBPACK_IMPORTED_MODULE_6__settings_settings__["a" /* default */]])
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
    template: __WEBPACK_IMPORTED_MODULE_1__template_main_html___default.a,
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

/* harmony default export */ __webpack_exports__["a"] = ('main');


/***/ }),
/* 22 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "<div class=\"main\">\r\n    <color-toolbar closed=\"true\" input-color=\"$ctrl.selectedWord.color\" color-modified=\"$ctrl.colorModified(color, linking)\" on-close=\"$ctrl.selectedWord=null\"></color-toolbar>  \r\n    <div class=\"main__colorizer\">\r\n        <text-colorizer on-wordselect=\"$ctrl.selectWord(word)\"></text-colorizer>\r\n        <div class=\"main__colorizer-controls\">\r\n            <a class=\"btn-bodyless btn-bodyless-success main__colorizer-button\" ng-click=\"$ctrl.inputComplete()\"><span class=\"glyphicon glyphicon-ok\"></span> Go!</a><span class=\"main__colorizer-separator\"></span>\r\n            <a class=\"btn-bodyless main__colorizer-button\" ng-click=\"$ctrl.edit()\" ><span class=\"glyphicon glyphicon-pencil\"></span> Edit</a><span class=\"main__colorizer-separator\"></span>\r\n            <a class=\"btn-bodyless btn-bodyless-danger main__colorizer-button\" ng-click=\"$ctrl.decolorizeDialog()\"><span class=\"glyphicon glyphicon-remove\"></span> Clear</a><span class=\"main__colorizer-separator\"></span> \r\n            <a class=\"btn-bodyless btn-bodyless-danger main__colorizer-button\" ng-click=\"$ctrl.dropDialog()\" ><span class=\"glyphicon glyphicon-trash\"></span> Drop</a> \r\n        </div>                            \r\n    </div>\r\n    <div class=\"main__adjustments-section main__section\">\r\n        <div class=\"main__section-content\">\r\n            <div class=\"main__section-title\">\r\n                <div class=\"main__section-label\">Adjustments & Profiles</div>\r\n            </div>\r\n            <div class=\"main__adjustments\">\r\n                <div class=\"main__adjustments-content\">\r\n                    <color-adjuster class=\"main__adjuster\"></color-adjuster>\r\n                    <div class=\"main__profiles\">\r\n                        <color-profiles colors=\"$ctrl.colors\" on-load-profile=\"$ctrl.loadColorProfile(colors, sPercentage, lPercentage)\"></color-profiles>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"main__settings-section main__section\">\r\n        <div class=\"main__section-content\">\r\n            <div class=\"main__section-title\">\r\n                <div ng-click=\"$ctrl.toggleSettings()\" class=\"main__section-label main__settings-label\"><span ng-class=\"$ctrl.settingsOpened ? 'dropup' : 'dropdown'\"><span class=\"caret main__caret\"></span></span> Settings</div>\r\n            </div>\r\n            <div class=\"main__settings\" ng-show=\"$ctrl.settingsOpened\">\r\n                <div class=\"main__settings-content\">\r\n                    <settings></settings>\r\n                </div>    \r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"main__find-container\">    \r\n        <a class=\"btn btn-success main__find-button\" ng-click=\"$ctrl.search()\"><span class=\"glyphicon glyphicon-search\"></span> Search!</a> \r\n    </div>\r\n    <div ng-show=\"$ctrl.resultFound\" class=\"main__image-finder\">\r\n        <image-finder search=\"$ctrl.searchData\" on-images-found=\"$ctrl.imagesFound(images)\"></image-finder>\r\n    </div>\r\n</div>";

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chartist_dist_scss_chartist_scss__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_chartist_dist_scss_chartist_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_chartist_dist_scss_chartist_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_chartist_js__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_chartist_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular_chartist_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularjs_slider__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularjs_slider___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_angularjs_slider__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scss_color_adjuster_scss__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scss_color_adjuster_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__scss_color_adjuster_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__template_color_adjuster_html__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__template_color_adjuster_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__template_color_adjuster_html__);






/**
* @module color-adjuster
* @requires module:angularjs-slider
* @requires module:angular-chartist
*/
angular.module('color-adjuster', [__WEBPACK_IMPORTED_MODULE_2_angularjs_slider___default.a, __WEBPACK_IMPORTED_MODULE_1_angular_chartist_js___default.a])
/** Adjusting of all selected colors (saturation & lightness).
* The global distribution of selected colors is shown in the chart.
* @member {Component} colorAdjuster
* @property {ColorAdjusterCtrl} controller
* @memberof module:color-adjuster
* @instance
*/
.component('colorAdjuster', {
    template: __WEBPACK_IMPORTED_MODULE_4__template_color_adjuster_html___default.a,
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

/* harmony default export */ __webpack_exports__["a"] = ('color-adjuster');


/***/ }),
/* 25 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 26 */,
/* 27 */,
/* 28 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = "<div class=\"color-adjuster\">\n    <div class=\"color-adjuster__chart\"><chartist class=\"ct-chart ct-square chart\" chartist-events=\"$ctrl.chart.events\" chartist-data=\"$ctrl.chart.data\" chartist-chart-options=\"$ctrl.chart.options\" chartist-responsive-options=\"$ctrl.chart.responsive\" chartist-chart-type=\"Pie\"></chartist></div>\n    <div class=\"sliders color-adjuster__sliders\">\n        <div class=\"color-adjuster__sliders-content\">\n            <div class=\"color-adjuster__slider\">\n                <div><span class=\"glyphicon glyphicon-signal\"></span> <span>{{$ctrl.getS()}}%</span></div>\n                <rzslider rz-slider-model=\"$ctrl.textColors.sPercentage\" rz-slider-options=\"$ctrl.slider.options\"></rzslider>\n            </div>\n            <div class=\"color-adjuster__slider\">\n                <div><span class=\"glyphicon glyphicon-adjust icon-flipped\"></span>  <span>{{$ctrl.getL()}}%</span></div> \n                <rzslider rz-slider-model=\"$ctrl.textColors.lPercentage\" rz-slider-options=\"$ctrl.slider.options\"></rzslider>\n            </div>\n        </div>\n    </div>\n</div>\n";

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_text_colorizer_scss__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_text_colorizer_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__scss_text_colorizer_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_text_colorizer_html__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_text_colorizer_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__template_text_colorizer_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__classes_Words__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__classes_Caret__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__classes_Helper__ = __webpack_require__(35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__classes_Parser__ = __webpack_require__(36);







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
    template: __WEBPACK_IMPORTED_MODULE_1__template_text_colorizer_html___default.a,
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
            this.words = new __WEBPACK_IMPORTED_MODULE_2__classes_Words__["a" /* default */](colorService, calculateFontColor);
            this.caret = new __WEBPACK_IMPORTED_MODULE_3__classes_Caret__["a" /* default */]($window);
            this.helper = new __WEBPACK_IMPORTED_MODULE_4__classes_Helper__["a" /* default */]($window, this.$, this.$root, this.caret);
            this.parser = new __WEBPACK_IMPORTED_MODULE_5__classes_Parser__["a" /* default */](this.$, $window, this.$root, colorService, this.words);
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

/* harmony default export */ __webpack_exports__["a"] = ('text-colorizer');


/***/ }),
/* 31 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = "<div class=\"text-colorizer__text\" ng-click=\"$ctrl.selectWord($event)\" ng-mousedown=\"$ctrl.handleMouseDown($event)\" ng-keydown=\"$ctrl.handleKeyDown($event)\" ng-paste=\"$ctrl.handlePaste($event)\"  contentEditable=\"{{$ctrl.editMode}}\" spellcheck=\"false\" placeholder=\"Insert text here...\" ></div>\n";

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* Represents a word node in the parsing tree. Contains DOM node
* for fast access and modifications.
* @constructor
* @param {Service} colorService Angularjs 'colorService' service
* @param {Factory} calcFontcolor Angularjs factory for calculation of font color according to the background color
* @memberof module:text-colorizer
*/
class Words {
    constructor(colorService, calcFontColor) {
        this.wordNodes = new Map();
        this.wordToWordNodes = new Map();
        this.colorFactory = colorService;
        this.calcFontColor = calcFontColor;
    }

    /** Assigns new dom node to the word node by id.
    * @method updateWordNode
    * @param {number} id Word node id
    * @param {Object} $domNode DOM node in jquery wrapper
    * @memberof module:text-colorizer.Words
    * @instance
    */
    updateWordNode(id, $domNode) {
        const wordNode = this.wordNodes.get(id);
        if (wordNode) {
            wordNode.$domNode = $domNode;
        }
    }


    /** Get all word nodes associated with given word.
    * @method getWordNodes
    * @param {string} word Word
    * @memberof module:text-colorizer.Words
    * @return {WordNode[]}
    * @instance
    */
    getWordNodes(word) {
        return this.wordToWordNodes.get(word);
    }

    /** Returns word node by its id.
    * @method getWordNode
    * @param {number} id - Word node id
    * @return {WordNode}
    * @memberof module:text-colorizer.Words
    * @instance
    */
    getWordNode(id) {
        return this.wordNodes.get(id);
    }

    /** Returns ids of all word nodes.
    * @method getIds
    * @return {number[]}
    * @memberof module:text-colorizer.Words
    * @instance
    */
    getIds() {
        return this.wordNodes.keys();
    }

    /** Returns all word nodes.
    * @method getAllWordNodes
    * @return {WordNode[]}
    * @memberof module:text-colorizer.Words
    * @instance
    */
    getAllWordNodes() {
        return this.wordNodes;
    }

    /** Returns a HashMap
    * @method getWordsToWordNodesMap
    * @return {Map<string, WordNode[]>}
    * @memberof module:text-colorizer.Words
    * @instance
    */
    getWordsToWordNodesMap() {
        return this.wordToWordNodes;
    }

    /** Inserts new word node.
    * @method addWordNode
    * @param {WordNode} wordNode
    * @memberof module:text-colorizer.Words
    * @instance
    */
    addWordNode(wordNode) {
        this.wordNodes.set(wordNode.id, wordNode);
        if (!this.wordToWordNodes.has(wordNode.word)) {
            this.wordToWordNodes.set(wordNode.word, new Map());
        }
        const wordNodes = this.wordToWordNodes.get(wordNode.word);
        wordNodes.set(wordNode.id, wordNode);
    }

    /** Removes word node by id.
    * @method removeWordNode
    * @param {number} id
    * @memberof module:text-colorizer.Words
    * @instance
    */
    removeWordNode(id) {
        this.wordNodes.delete(id);
        for (const wordNodes of this.wordToWordNodes.values()) {
            if (wordNodes.has(id)) {
                wordNodes.delete(id);
                break;
            }
        }
    }

    /** Reset colors of word node by id.
    * Resets all word nodes with the same word.
    * @method resetColor
    * @param {number} id
    * @memberof module:text-colorizer.Words
    * @instance
    */
    resetColor(id) {
        const wordNode = this.wordNodes.get(id);
        const wordNodes = this.wordToWordNodes.get(wordNode.word);
        for (const node of wordNodes.values()) {
            node.resetColor();
        }
    }

    /** Resets color only in word node with given id.
    * @method resetOneColor
    * @param {number} id
    * @memberof module:text-colorizer.Words
    * @instance
    */
    resetOneColor(id) {
        const wordNode = this.wordNodes.get(id);
        wordNode.resetColor();
    }

    /** Set color in one specific word node by given id.
    * @method setColorOnce
    * @param {number} id Word node id
    * @param {Color} color Color object
    * @memberof module:text-colorizer.Words
    * @instance
    */
    setColorOnce(id, color) {
        const fontColor = this.calcFontColor(color);
        const wordNode = this.wordNodes.get(id);
        wordNode.setColor(color, fontColor);
    }

    /** Set color in all word nodes with the same word by given id.
    * @method setColor
    * @param {number} id Word node id
    * @param {Color} color Color object
    * @memberof module:text-colorizer.Words
    * @instance
    */
    setColor(id, color) {
        const wordNode = this.wordNodes.get(id);
        this.setColorByWord(wordNode.word, color);
    }

    /** Set color in all word nodes with the same word by given word.
    * @method setColorByWord
    * @param {string} word Word
    * @param {Color} color Color object
    * @memberof module:text-colorizer.Words
    * @instance
    */
    setColorByWord(word, color) {
        const wordNodes = this.wordToWordNodes.get(word);
        if (wordNodes) {
            const fontColor = this.calcFontColor(color);
            for (const node of wordNodes.values()) {
                node.setColor(color, fontColor);
            }
        }
    }

    /** Resets all word nodes (decolorize words).
    * @method resetAllColors
    * @memberof module:text-colorizer.Words
    * @instance
    */
    resetAllColors() {
        for (const wordNode of this.wordNodes.values()) {
            wordNode.resetColor();
        }
    }

    /** Deletes all word nodes
    * @method clear
    * @memberof module:text-colorizer.Words
    * @instance
    */
    clear() {
        this.wordNodes.clear();
        this.wordToWordNodes.clear();
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Words);


/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (Caret);


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Helper {

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
/* harmony export (immutable) */ __webpack_exports__["a"] = Helper;



/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_xregexp__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_xregexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_xregexp__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__WordNode__ = __webpack_require__(38);



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
        this._wordRegex = __WEBPACK_IMPORTED_MODULE_0_xregexp___default()("\\pL+(?:[-'’]?\\pL+)*", 'gi');
        this._wordFormatRegex = __WEBPACK_IMPORTED_MODULE_0_xregexp___default()("^(?:\\pL+(?:[-'’]?\\pL+)*)$", 'i');
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
            const wordNode = new __WEBPACK_IMPORTED_MODULE_1__WordNode__["a" /* default */](id, needle.toLowerCase(),
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
                const newWordNode = new __WEBPACK_IMPORTED_MODULE_1__WordNode__["a" /* default */](newId, needle.toLowerCase(),
                this._colorService.getColorInstance(wordNode.color), this.$(domNode));
                this._words.addWordNode(newWordNode);
                return domNode;
            });
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Parser);


/***/ }),
/* 37 */,
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (WordNode);


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angularjs_slider__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angularjs_slider___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_angularjs_slider__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_color_toolbar_scss__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scss_color_toolbar_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__scss_color_toolbar_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__template_color_toolbar_html__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__template_color_toolbar_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__template_color_toolbar_html__);




/**
* @module color-toolbar
* @requires module:angularjs-slider
*/
angular.module('color-toolbar', [__WEBPACK_IMPORTED_MODULE_0_angularjs_slider___default.a])
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
    template: __WEBPACK_IMPORTED_MODULE_2__template_color_toolbar_html___default.a,
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

/* harmony default export */ __webpack_exports__["a"] = ('color-toolbar');



/***/ }),
/* 40 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = "<div class=\"toolbar\">\n    <div class=\"toolbar__content\">\n        <div class=\"toolbar__left\">\n            <div class=\"toolbar__colorbox\" ng-click=\"$ctrl.selectColor($event)\">\n                <div ng-repeat=\"c in $ctrl.colors track by $index\">\n                    <div class=\"toolbar__color\" data-toolbar-color=\"{{$index}}\" ng-style=\"{'background-color': c}\"></div>\n                </div>\n                <div class=\"toolbar__color\" data-toolbar-color=\"null\"><span class=\"glyphicon glyphicon-remove toolbar__clear\"></span></div>\n                <div style=\"clear:both;\"></div>\n            </div>\n        </div>  \n        <div class=\"toolbar__center\">\n            <div class=\"toolbar__adjuster\">\n                <div class=\"toolbar__sliders\" ng-disabled=\"!$ctrl.color.isSet()\">\n                    <div class=\"toolbar__sliders-content\">\n                        <div class=\"toolbar__saturation-slider\">\n                            <span class=\"glyphicon glyphicon-signal\"></span> <span>{{$ctrl.color.isSet() ? $ctrl.color.s : 0 }}%</span>\n                            <rzslider rz-slider-model=\"$ctrl.color.s\" rz-slider-options=\"$ctrl.slider.options\"></rzslider>\n                        </div>\n                        <div class=\"toolbar__lightness-slider\">\n                            <span class=\"glyphicon glyphicon-adjust icon-flipped\"></span>  <span>{{$ctrl.color.isSet() ? $ctrl.color.l : 0 }}%</span>\n                            <rzslider rz-slider-model=\"$ctrl.color.l\" rz-slider-options=\"$ctrl.slider.options\"></rzslider>\n                        </div>\n                    </div>\n                </div>\n                <div class=\"toolbar__weight\">\n                    <div class=\"toolbar__weight-title\">Weight</div>\n                    <div class=\"toolbar__weight-controls\">\n                        <div class=\"toolbar__weight-buttons btn-group-vertical\" role=\"group\">\n                            <a type=\"button\" class=\"btn btn-default btn-block btn-square toolbar__weight-button\" ng-click=\"$ctrl.increaseWeight()\">+</a>\n                            <a type=\"button\" class=\"btn btn-default btn-block btn-square toolbar__weight-button\" ng-click=\"$ctrl.decreaseWeight()\">-</a>\n                        </div>\n                        <div class=\"toolbar__weight-value\">{{$ctrl.color.weight}}</div>\n                    </div>\n                </div>\n            </div>        \n        </div>             \n        <div class=\"toolbar__right\">\n            <div class=\"toolbar__selected\">\n                <div class=\"toolbar__selected-color\" ng-click=\"$ctrl.wordLinking = !$ctrl.wordLinking\" ng-style=\"{'background-color': $ctrl.color}\"><span ng-show=\"$ctrl.wordLinking\" class=\"toolbar__linking-icon glyphicon glyphicon-link\" ng-style=\"{color: $ctrl.linkingIconColor()}\"></span></div>\n                <div class=\"toolbar__selected-background\"></div>                   \n            </div> \n            <div class=\"toolbar__close\" ng-click=\"$ctrl.close()\">\n                <span class=\"glyphicon glyphicon-menu-up toolbar__close-icon\"></span>\n            </div>   \n        </div> \n    </div>\n</div>";

/***/ }),
/* 42 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ng_infinite_scroll__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ng_infinite_scroll___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ng_infinite_scroll__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng_error__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ng_error___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_ng_error__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng_load__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ng_load___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_ng_load__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scss_image_finder_scss__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scss_image_finder_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__scss_image_finder_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__template_image_finder_html__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__template_image_finder_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__template_image_finder_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__classes_Images__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__classes_ImagesRPCService__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__classes_ImageInspector__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__image_viewer_image_viewer__ = __webpack_require__(51);










/**
* Module for image search and result representation.
* Uses 'jsonrpc' module for server connection and scrolling module
* for the on-scroll lazy loading of images.
* @module image-finder
* @requires module:jsonrpc
* @requires module:ng-infinite-scroll
* @requires module:ng-error
* @requires module:ng-load
*/
angular.module('image-finder', ['jsonrpc', __WEBPACK_IMPORTED_MODULE_0_ng_infinite_scroll___default.a, 'ngError', 'ngLoad'])
/** Images model.
* @member {Service} images
* @memberof module:image-finder
* @see Images class
* @instance
*/
.service('images', ['jsonrpc', 'login', function (jsonrpc, login) {
    return new __WEBPACK_IMPORTED_MODULE_5__classes_Images__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_6__classes_ImagesRPCService__["a" /* default */](jsonrpc, login));
}])
/** Image inspector model.
* @member {Service} imageInspector
* @memberof module:image-finder
* @see ImageInspector class
* @instance
*/
.service('imageInspector', ['$window', '$document', 'images', function ($window, $document, images) {
    return new __WEBPACK_IMPORTED_MODULE_7__classes_ImageInspector__["a" /* default */]($window, $document, images);
}])
/** Component for image detailed view.
* @member {Component} imageViewer
* @property {ImageViewerCtrl} controller
* @property {String} template
* @property {Object} bindings {image: '<', onClose: '&', onImagesUpdated: '&'}
* @memberof module:image-finder
* @instance
*/
.component(__WEBPACK_IMPORTED_MODULE_8__image_viewer_image_viewer__["b" /* imageViewerCompName */], __WEBPACK_IMPORTED_MODULE_8__image_viewer_image_viewer__["a" /* imageViewerComp */])
/** Main component of the module.
* Searches for images and represents the search results.
* @member {Component} imageFinder
* @property {ImageFinderCtrl} controller
* @property {String} template
* @property {Object} bindings {onImagesFound: '&', search: '<'}
* @memberof module:image-finder
* @instance
*/
.component('imageFinder', {
    template: __WEBPACK_IMPORTED_MODULE_4__template_image_finder_html___default.a,
    bindings: {
        onImagesFound: '&',
        search: '<',
    },
    /**
    * Controller for 'imageFinder' component.
    * @constructor ImageFinderCtrl
    * @param {Service} $document Angularjs '$document'
    * @param {Service} images 'images' service
    * @param {Service} imageInspector 'imageInspectro' service
    * @param {Service} usSpinnerService 'usSpinnerService' service
    * @see imageFinder component
    * @memberof module:image-finder
    */
    controller: class ImageFinderCtrl {
        static get $inject() {
            return ['$document', 'images', 'imageInspector', 'usSpinnerService'];
        }

        constructor($document, images, imageInspector, spinner) {
            this.$document = $document;
            this._imageInspector = imageInspector;
            this._spinner = spinner;
            this._step = 10;
            this._images = images;
            this._findPending = false;
            this.selectedImage = null;
            this.imagesToShow = [];
        }

        /** Component hook method
        * @method $onInit
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        $onInit() {
            this.imagesToShow = this._images.getImagesInInterval(0, this._images.showIndex);
        }

        /** Component hook method
        * @method $onChanges
        * @param {Object} changes
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        $onChanges(changes) {
            const search = changes.search.currentValue;
            if (search && !this._findPending) {
                this.imagesToShow.length = 0;
                const wordsAndColors = search.words;
                const settings = search.settings;
                if (settings && wordsAndColors) {
                    this._findPending = true;
                    this._spinner.spin('spinner-1');
                    this._images.findImages(wordsAndColors, settings, () => {
                        this._findPending = false;
                        this._spinner.stop('spinner-1');
                        this.imagesToShow = this._images.getImagesInInterval(0, this._step);
                        this._images.showIndex = this._step;
                        this.onImagesFound({
                            images: this._images.getImagesArray(),
                        });
                    });
                }
            }
        }

        /**
        * @method checkForImageFailure
        * @param {Image} img
        * @param {Object} imgNode Image DOM node
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        checkForImageFailure(img, imgNode) {
            this._images.checkForImageFailure(img, (failure) => {
                if (failure) {
                    this._images.removeImage(img);
                    angular.element(imgNode).remove();
                    this.showMore();
                }
            });
        }

        /** Event handler
        * @method  thumbnailLoaded
        * @param {Object} $event Angularjs '$event'
        * @param {Image} img
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        thumbnailLoaded($event, img) {
            this._imageInspector.inspect(img, $event.target,
            this.checkForImageFailure.bind(this));
        }

        /** Event handler
        * @method thumbnailLoadingError
        * @param {Object} $event Angularjs '$event'
        * @param {Image} img
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        thumbnailLoadingError($event, img) {
            this.checkForImageFailure(img, $event.target);
        }

         /** Show more images on scroll.
        * @method showMore
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        showMore() {
            this.imagesToShow = this.imagesToShow
            .concat(this._images.getImagesInInterval(this._images.showIndex, this._images.showIndex + this._step));
            this._images.showIndex += this._step;
        }

        /** Selects current image. A change of current
        * image will be propagated to the 'imageViewer'
        *  component through bindings. Thus a selected
        * image will be shown in detailed view.
        * @method selectImage
        * @param {Object} $event Angularjs '$event'
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        selectImage($event) {
            const target = $event.target;
            if (target.hasAttribute('imagefinder-image') ||
            angular.element(target).parent()[0].hasAttribute('imagefinder-image')) {
                $event.stopPropagation();
                const id = (target.hasAttribute('imagefinder-image')) ?
                            angular.element(target).attr('imagefinder-image') :
                            angular.element(target).parent().attr('imagefinder-image');
                this.selectedImage = this._images.getImage(id);
            }
        }

        /** Invoked if the result set was updated, for example if some
        * images were removed.
        * @method imagesUpdated
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        imagesUpdated() {
            this.imagesToShow = this._images.getImagesInInterval(0, this._images.showIndex);
        }
    },
});

/* harmony default export */ __webpack_exports__["a"] = ('image-finder');


/***/ }),
/* 43 */,
/* 44 */,
/* 45 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = "<div class=\"image-finder\">\n    <div class=\"image-finder__container\">\n        <div ng-click=\"$ctrl.selectImage($event)\" class=\"image-finder__images\" infinite-scroll='$ctrl.showMore()' infinite-scroll-distance='0'>\n            <div ng-repeat=\"img in $ctrl.imagesToShow track by img.id\">\n                <img imagefinder-image=\"{{img.id}}\" ng-src=\"{{img.previewURL}}\" class=\"image-finder__image\" ng-error=\"$ctrl.thumbnailLoadingError($event, img)\" ng-load=\"$ctrl.thumbnailLoaded($event, img)\">\n            </div>\n        </div>\n    </div>\n    <image-viewer ng-show=\"$ctrl.selectedImage\" image=\"$ctrl.selectedImage\" on-images-updated=\"$ctrl.imagesUpdated()\" on-close=\"$ctrl.selectedImage = null\"></image-viewer>\n</div>";

/***/ }),
/* 47 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Image__ = __webpack_require__(48);


/**
* Images model class.
* Manages images and requests server with the help of 'ImagesRPCService'.
* @constructor:
* @param {ImagesRPCService} service 'ImagesRPCService' instance
* @memberof module:image-finder
*/
class Images {

    constructor(service) {
        this.images = [];
        this.service = service;
        this.showIndex = 0;
    }

    /** Creates new image and adds it to the result set.
    * @method addImage
    * @param {Object} o Object that contains data for image creation
    * @memberof module:image-finder.Images
    * @instance
    */
    addImage(o) {
        const img = new __WEBPACK_IMPORTED_MODULE_0__Image__["a" /* default */](o);
        this.images.push(img);
    }

    /** Removes image from result set.
    * @method removeImage
    * @param {Image} image Image object
    * @memberof module:image-finder.Images
    * @instance
    */
    removeImage(image) {
        for (let i = 0; i < this.images.length; i++) {
            if (this.images[i].id == image.id) {
                this.images.splice(i, 1);
                break;
            }
        }
    }

    /** Returns image by id.
    * @method getImage
    * @param {Number} id Image id
    * @return {Image}
    * @memberof module:image-finder.Images
    * @instance
    */
    getImage(id) {
        let image = null;
        for (let i = 0, k = this.images.length; i < k; i++) {
            if (this.images[i].id == id) {
                image = this.images[i];
                break;
            }
        }
        return image;
    }

    /** Returns all images (result set) as array.
    * @method getImagesArray
    * @return {Image[]}
    * @memberof module:image-finder.Images
    * @instance
    */
    getImagesArray() {
        return this.images;
    }

    /** Number of images in result set.
    * @method count
    * @return {Number}
    * @memberof module:image-finder.Images
    * @instance
    */
    count() {
        return this.images.length;
    }

    /** Returns images from result set in given interval.
    * @method getImagesInInterval
    * @param {Number} start Start index
    * @param {Number} end End index
    * @return {Image[]}
    * @memberof module:image-finder.Images
    * @instance
    */
    getImagesInInterval(start, end) {
        if (start >= 0 && start < this.images.length) {
            if (end > this.images.length) {
                end = this.images.length;
            }
            return this.images.slice(start, end);
        }
        return [];
    }

    /** Deletes all images from result set.
    * @method empty
    * @memberof module:image-finder.Images
    * @instance
    */
    empty() {
        this.images.length = 0;
    }

    /** Checks if the image is faulty.
    * @method checkForImageFailure
    * @param {Image} img Image to check
    * @param {Function} callback Callback function (optional).
    * @memberof module:image-finder.Images
    * @instance
    */
    checkForImageFailure(img, callback) {
        this.service.checkForImageFailure(img, callback);
    }

    /** Search for images.
    * @method findImages
    * @param {Object} data Colors and words.
    * @param {Service} searchSettings Search settings model.
    * @param {Function} callback Callback function.
    * @memberof module:image-finder.Images
    * @instance
    */
    findImages(data, searchSettings, callback) {
        this.empty();
        this.service.findImages(this, data, searchSettings, callback);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Images);


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* Represents image.
* @constructor
* @param {Object} conf Configuration object with image data
* @property {Number} id
* @property {String} url
* @property {String} previewURL
* @property {Number} score
* @property {String} source
* @property {String} title
* @property {String} owner
* @memberof module:image-finder
*/
class Image {
    constructor(conf) {
        this.id = conf.id;
        this.url = conf.url;
        this.previewURL = conf.previewURL;
        this.originalURL = conf.originalURL;
        this.score = parseFloat(conf.score).toFixed(2);
        this.source = conf.source;
        this.title = conf.title || "unknown";
        this.owner = conf.owner || "unknown";
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Image);


/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* Sends requests to the server using JsonRPC service.
* Uses Login service for client-server authentication.
* @constructor
* @param {Service} jsonrpc - 'jsonrpc' service
* @param {Service} login - 'login' service
* @memberof module:image-finder
*/
class ImagesRPCService {

    constructor(jsonrpc, login) {
        this.jsonrpc = jsonrpc;
        this.login = login;
    }

    /** Check image for failure. Sends request to the server.
    * @method checkForImageFailure
    * @param {Image} img Object that contains data for image creation
    * @param {Function} callback (optional) Callback function
    * @memberof module:image-finder.ImagesRPCService
    * @instance
    */
    checkForImageFailure(img, callback) {
        this.jsonrpc.request('checkImage', { image: img })
        .then((failure) => {
            if (callback) {
                callback(failure);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    /** Searching for similar images. Sends request to the server.
    * @method findImages
    * @param {Images} images Images model
    * @param {Object} data Object with data for search {colors: HSLImage[], words: string[]}
    * @param {Settings} searchSettings Settings model
    * @param {Function} callback Callback function
    * @memberof module:image-finder.ImagesRPCService
    * @instance
    */
    findImages(images, data, searchSettings, callback) {
        const self = this;
        this.jsonrpc.request('find', { colors: data.colors, words: data.words, settings: searchSettings.serialize(), auth: self.login.auth })
        .then((result) => {
            if (result && result.imgs && result.imgs.length > 0) {
                images.empty();
                for (let i = 0; i < result.imgs.length; i++) {
                    images.addImage(result.imgs[i]);
                }
            }
            result = null;
            if (callback) {
                callback();
            }
        })
        .catch((error) => {
            console.error(error);
            if (callback) {
                callback();
            }
        });
    }
}

/* harmony default export */ __webpack_exports__["a"] = (ImagesRPCService);



/***/ }),
/* 50 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
* Inspects flickr images and decides if an image could be faulty.
* Calls user callback if the image is suspicious.
* @constructor FlickrInspectingStrategy
* @memberof module:image-finder
*/
class FlickrInspectingStrategy {

    constructor() {
        this._errorWidth = [320, 500];
        this._errorHeight = [240, 374];
    }

    /** Inspects one element and call callback function if
    * image tend to be faulty.
    * @method inspect
    * @param {Object} elem {imageNode: DOMnode, image: Image, callback: Function}
    * @memberof module:image-finder.FlickrInspectingStrategy
    * @instance
    */
    inspect(elem) {
        const width = elem.imageNode.naturalWidth;
        const height = elem.imageNode.naturalHeight;
        if ((width === this._errorWidth[0] && height === this._errorHeight[0]) ||
            (width === this._errorWidth[1] && height === this._errorHeight[1])) {
            if (elem.callback) {
                elem.callback(elem.image, elem.imageNode);
            }
        }
    }
}

/**
* Batch for loaded images, which must be inspected.
* @constructor InspectingBatch
* @param {$window} $window Angularjs '$window' service
* @param {$document} $document Angularjs '$document' service
* @param {Map} strategies HashMap with inspecting strategies
* @param {number} portion Portion of images which will be inspected in one step
* @memberof module:image-finder
*/
class InspectingBatch {

    constructor($window, $document, strategies, portion) {
        this._imagesToInspect = [];
        this._strategies = strategies;
        this._portion = portion;
        this.$window = $window;
        setInterval(this._inspect.bind(this), 500);
    }

    /** Size of the batch
    * @method size
    * @return {Number}
    * @memberof module:image-finder.InspectingBatch
    * @instance
    */
    size() {
        return this._imagesToInspect.length;
    }

    /** Adds one element into batch.
    * @method add
    * @param {Object} element {imageNode: DOMnode, image: Image, callback: Function}
    * @memberof module:image-finder.InspectingBatch
    * @instance
    */
    add(element) {
        this._imagesToInspect.push(element);
    }

    _inspect() {
        const list = this._imagesToInspect.splice(0, this._portion);
        for (const elem of list) {
            const strategy = this._strategies.get(elem.image.source);
            if (strategy) {
                strategy.inspect(elem);
            }
        }
    }
}

/**
* Inspects images for failure
* @constructor
* @param {$window} $window Angularjs '$window' service
* @param {$document} $document Angularjs '$document' service
* @memberof module:image-finder
*/
class ImageInspector {

    constructor($window, $document) {
        const strategies = new Map()
        .set("flickr", new FlickrInspectingStrategy());
        this.batch = new InspectingBatch($window, $document, strategies, 20);
    }

    /** Add element for inspection.
    * @method inspect
    * @param {Image} image Image object
    * @param {Object} imageNode Image DOM node
    * @param {function} callback Callback function will be called, if image tend to be faulty.
    * @memberof module:image-finder.ImageInspector
    * @instance
    */
    inspect(image, imageNode, callback) {
        this.batch.add({ image, imageNode, callback });
    }
}

/* harmony default export */ __webpack_exports__["a"] = (ImageInspector);


/***/ }),
/* 51 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_image_viewer_scss__ = __webpack_require__(52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_image_viewer_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__scss_image_viewer_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_image_viewer_html__ = __webpack_require__(53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_image_viewer_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__template_image_viewer_html__);



const imageViewerCompName = 'imageViewer';
/* harmony export (immutable) */ __webpack_exports__["b"] = imageViewerCompName;

const imageViewerComp = {
    template: __WEBPACK_IMPORTED_MODULE_1__template_image_viewer_html___default.a,
    bindings: {
        image: '<',
        onClose: '&',
        onImagesUpdated: '&',
    },
    controller: class ImageViewerCtrl {

        static get $inject() {
            return ['$scope', '$window', '$element', '$timeout', '$document', 'imageInspector', 'images', 'usSpinnerService'];
        }

        constructor($scope, $window, $element, $timeout, $document, imageInspector, images, spinner) {
            this.$scope = $scope;
            this.$window = $window;
            this.$element = $element;
            this.$timeout = $timeout;
            this._imageInspector = imageInspector;
            this._spinner = spinner;
            this._images = images;
            this._canvas = $document[0].createElement('canvas');
            this._canvasContext = this._canvas.getContext("2d");
            this._imageDownload = $element.find(".image-viewer__download")[0];
        }

        $onChanges(changes) {
            this.selectedImage = angular.copy(changes.image.currentValue);
            if (this.selectedImage) {
                this._spinner.spin('spinner-1');
                angular.element('body').addClass('stop-scrolling');
            }
        }

        $postLink() {
            this.$window.addEventListener('keydown', (event) => {
                if (this.selectedImage && event.keyCode === 27) {
                    this.close(event);
                    this.$scope.$apply();
                }
            });
        }

        getScore() {
            if (this.selectedImage) {
                return parseFloat(this.selectedImage.score * 100).toFixed(2);
            }
            return null;
        }

        originalURL() {
            this.$window.open(this.selectedImage.originalURL);
        }

        loaded($event, img) {
            this._spinner.stop('spinner-1');
            const imageNode = $event.target;
            this._imageInspector.inspect(img, $event.target,
                this._images.checkForImageFailure(img, (failure) => {
                    if (failure) {
                        this._images.removeImage(img);
                        angular.element('body').removeClass('stop-scrolling');
                        this.selectedImage = null;
                        this.onClose();
                        this.onImagesUpdated();
                    }
            }));
        }

        loadingError(image) {
            this._spinner.stop('spinner-1');
            this._images.checkForImageFailure(image);
            this._images.removeImage(image);
            angular.element('body').removeClass('stop-scrolling');
            this.selectedImage = null;
            this.onClose();
            this.onImagesUpdated();
        }

        save() {
            this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._imageDownload.href = "";
            this._imageDownload.download = "";
            if (this.selectedImage) {
                const image = new Image();
                image.crossOrigin = "anonymous";
                image.onload = () => {
                    this._canvas.width = image.naturalWidth;
                    this._canvas.height = image.naturalHeight;
                    let url = null;
                    try {
                        this._canvasContext.drawImage(image, 0, 0);
                        if (image.src.indexOf(".jpg") > -1) {
                            url = this._canvas.toDataURL("image/jpeg");
                        } else if (image.src.indexOf(".gif") > -1) {
                            url = this._canvas.toDataURL("image/gif");
                        } else {
                            url = this._canvas.toDataURL("image/png");
                        }
                    } catch (e) {
                        console.error(e);
                    }
                    if (url) {
                        this._imageDownload.href = url;
                        this._imageDownload.download = image.src.split(/(\\|\/)/g).pop();
                        this.$timeout(() => {
                            this._imageDownload.click();
                        }, 100, false);
                    }
                };
                image.onerror = (e) => {
                    console.log(e);
                    const win = this.$window.open(this.selectedImage.url, '_blank');
                    win ? win.focus() : null;
                };
                image.src = this.selectedImage.url;
            }
        }

        close($event) {
            const target = $event.target;
            if (target.hasAttribute("imageviewer-close") || $event.keyCode === 27) {
                $event.stopPropagation();
                this._spinner.stop('spinner-1');
                angular.element('body').removeClass('stop-scrolling');
                this.selectedImage = null;
                this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
                this._imageDownload.href = "";
                this._imageDownload.download = "";
                this.onClose();
            }
        }
    },
};
/* harmony export (immutable) */ __webpack_exports__["a"] = imageViewerComp;



/***/ }),
/* 52 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = "<div class=\"image-viewer\">    \r\n    <div class=\"image-viewer__topline\">\r\n        <div class=\"image-viewer__topline-main\">\r\n            <div class=\"image-viewer__topline-content\">\r\n                <a class=\"image-viewer__original\" target=\"_blank\" href=\"{{$ctrl.selectedImage.originalURL}}\">Original</a>\r\n                <span class=\"image-viewer__separator\"></span>\r\n                <span class=\"image-viewer__score\">{{$ctrl.getScore()}}%</span>\r\n                <span class=\"image-viewer__separator\"></span>\r\n                <a class=\"image-viewer__save\" ng-click=\"$ctrl.save()\">\r\n                    <span class=\"glyphicon glyphicon-floppy-save image-viewer__save-icon\"></span>\r\n                </a>\r\n                <div ng-click=\"$ctrl.close($event)\" class=\"image-viewer__close-button\" imageviewer-close>\r\n                    <span class=\"glyphicon glyphicon-remove image-viewer__close-icon\" aria-hidden=\"true\" imageviewer-close></span>\r\n                </div>\r\n            </div> \r\n        </div>\r\n        <div class=\"image-viewer__info\">\r\n            <div class=\"image-viewer__attribution\">\r\n                <div class=\"image-viewer__title\">{{$ctrl.selectedImage.title}}</div>\r\n                <div>by</div>\r\n                <div class=\"image-viewer__owner\">{{$ctrl.selectedImage.owner}}</div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"image-viewer__image-container\" ng-click=\"$ctrl.close($event)\" imageviewer-close>\r\n        <img class=\"image-viewer__image\" src=\"{{$ctrl.selectedImage.url}}\" ng-load=\"$ctrl.loaded($event, $ctrl.selectedImage)\" ng-error=\"$ctrl.loadingError($ctrl.selectedImage)\">\r\n        <a class=\"image-viewer__download\"></a>\r\n    </div>\r\n</div>";

/***/ }),
/* 54 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_settings_scss__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_settings_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__scss_settings_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_settings_html__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_settings_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__template_settings_html__);



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
    template: __WEBPACK_IMPORTED_MODULE_1__template_settings_html___default.a,

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

/* harmony default export */ __webpack_exports__["a"] = ('settings');


/***/ }),
/* 55 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = "<div class=\"settings\">\r\n    <div class=\"checkbox\">\r\n        <label>\r\n            <input ng-model=\"$ctrl.settings.checkSemanticSimilarity\" type=\"checkbox\">Analyze semantics (experimental)\r\n        </label>\r\n    </div>\r\n    <div>\r\n        <div class=\"radio\">\r\n            <label>\r\n                <input type=\"radio\" name=\"optionsRadios\"  ng-model=\"$ctrl.settings.searchMode\" value=\"regular\" checked>Regular search (fast)\r\n            </label>\r\n        </div>\r\n        <div class=\"radio\">\r\n            <label>\r\n                <input type=\"radio\" name=\"optionsRadios\" ng-model=\"$ctrl.settings.searchMode\" value=\"special\">Special search (slow)\r\n            </label>\r\n        </div>\r\n    </div>\r\n    <div ng-class=\"$ctrl.settings.searchMode == 'special' ? 'settings__special-search_show' : 'settings__special-search_hide'\">\r\n        <select ng-model=\"$ctrl.settings.distance\">\r\n            <option ng-repeat=\"distance in $ctrl.settings.supportedDistances track by $index\" data-distances-distance=\"{{$index}}\" value=\"{{distance.id}}\">{{distance.name}}</option>\r\n        </select>             \r\n        <div class=\"settings__similarity-level\">\r\n            <div>Similarity level: <span>{{$ctrl.similarityLevel}}%</span></div>\r\n            <rzslider rz-slider-model=\"$ctrl.similarityLevel\" rz-slider-options=\"$ctrl.slider.options\"></rzslider>\r\n        </div>\r\n    </div>\r\n</div>\r\n";

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_guide_scss__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_guide_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__scss_guide_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_guide_html__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_guide_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__template_guide_html__);



/**
* Module 
* @module guide
*/
angular.module('guide', [])
/** Guide component. Represents a 'guide' page in the web application.
* @member {Component} guide
* @property {String} template
* @memberof module:guide
* @instance
*/
.component('guide', {
    template: __WEBPACK_IMPORTED_MODULE_1__template_guide_html___default.a,
});

/* harmony default export */ __webpack_exports__["a"] = ('guide');


/***/ }),
/* 58 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = "<div class=\"guide\">\r\n    <div class=\"guide__content\">\r\n        <p class=\"guide__title\">This application allows you to find images by color!</p>\r\n        <p>1. Write your text in the editor on main page</p>\r\n        <p>2. Color your text with the color tool bar</p>\r\n        <p>3. Set your desired search settings (optional)</p>\r\n        <p class=\"guide__search-settings\"><span class=\"glyphicon glyphicon-triangle-right\"></span> The experimental feature for semantic similarity calculates\r\n        the semantic similarity rank for each similar image and sorts the result set by\r\n        this value. You can perform a specific search by choosing a desired similarity level and distance function.\r\n        <br><span class=\"glyphicon glyphicon-triangle-right\"></span> You can create and manage multiple color profiles.\r\n        Contents of the existing color profiles can be inspected in the \"Archive\" section.</p>\r\n        <p>4. Search!</p>\r\n    </div>\r\n</div>";

/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ng_infinite_scroll__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ng_infinite_scroll___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_ng_infinite_scroll__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__classes_ColorProfiles__ = __webpack_require__(61);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__color_profiles_color_profiles__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__profiles_viewer_profiles_viewer__ = __webpack_require__(67);





/**
* Module for color profiles
* @module profiles
* @requires module:ng-infinite-scroll
*/
angular.module('profiles', [__WEBPACK_IMPORTED_MODULE_0_ng_infinite_scroll___default.a])
/** Color profiles model.
* @member {Service} colorProfiles
* @memberof module:profiles
* @see ColorProfiles class
* @instance
*/
.service('colorProfiles', ['db', 'colorService', function (dbService, colorService) {
    return new __WEBPACK_IMPORTED_MODULE_1__classes_ColorProfiles__["a" /* default */](dbService, colorService);
}])
/** Color profiles component. Used to create, update and load of color profiles.
* @member {Component} colorProfiles
* @property {ColorProfilesCtrl} controller
* @property {String} template
* @memberof module:profiles
* @instance
*/
.component(__WEBPACK_IMPORTED_MODULE_2__color_profiles_color_profiles__["b" /* colorProfilesCompName */], __WEBPACK_IMPORTED_MODULE_2__color_profiles_color_profiles__["a" /* colorProfilesComp */])
/** Color profiles viewer component. Shows color profiles
* which are saved in client database.
* @member {Component} profilesViewer
* @property {ProfilesViewerCtrl} controller
* @property {String} template
* @memberof module:profiles
* @instance
*/
.component(__WEBPACK_IMPORTED_MODULE_3__profiles_viewer_profiles_viewer__["b" /* profilesViewerCompName */], __WEBPACK_IMPORTED_MODULE_3__profiles_viewer_profiles_viewer__["a" /* profilesViewerComp */]);

/* harmony default export */ __webpack_exports__["a"] = ('profiles');


/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ColorProfile__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ColorProfilesDAO__ = __webpack_require__(62);



/**
* Saves, loads and updates color profiles.
* @constructor
* @param {Service} dbService - 'db' service
* @param {Service} colorService - 'colorService' service
* @memberof module:profiles
*/
class ColorProfiles {

    constructor(dbService, colorService) {
        this.profileNames = [];
        this.loadedProfile = null;
        this.dao = new __WEBPACK_IMPORTED_MODULE_1__ColorProfilesDAO__["a" /* default */](dbService, colorService);
    }

    /** Loads all existing color profile names while initialization
    * and sets the first one as a current color profile.
    * @method init
    * @memberof module:profiles.ColorProfiles
    * @instance
    */
    init(callback) {
        this.loadColorProfileNames(() => {
            this.loadColorProfile(this.profileNames[0], () => {
                callback();
            });
        });
    }

    /** Creates new color profile.
    * @method createColorProfile
    * @param {String} name Name of color profile
    * @param {Map} colors Word-to-Color HashMap
    * @param {Number} sPercentage Saturation settings
    * @param {Number} lPercentage Lightness settings
    * @param {Function} callback Callback function
    * @memberof module:profiles.ColorProfiles
    * @instance
    */
    createColorProfile(name, colors, sPercentage, lPercentage, callback) {
        const profile = new __WEBPACK_IMPORTED_MODULE_0__ColorProfile__["a" /* default */](name, colors, sPercentage, lPercentage);
        this.dao.saveColorProfile(profile, this, callback);
    }

    /** Loads and sets color profile from database.
    * @method loadColorProfile
    * @param {String} name Name of color profile
    * @param {Function} callback Callback function
    * @memberof module:profiles.ColorProfiles
    * @instance
    */
    loadColorProfile(name, callback) {
        this.dao.loadColorProfile(name, (profile) => {
            this.loadedProfile = profile;
            if (callback) {
                callback();
            }
        });
    }

    /** Loads and returns color profile from database by name.
    * @method getColorProfile
    * @param {String} name Name of color profile
    * @param {Function} callback Callback function
    * @memberof module:profiles.ColorProfiles
    * @instance
    */
    getColorProfile(name, callback) {
        if (name) {
            this.dao.loadColorProfile(name, (profile) => {
                callback(profile);
            });
        }
    }

    /** Loads all existing color profile names from client database.
    * @method loadColorProfileNames
    * @param {Function} callback Callback function
    * @memberof module:profiles.ColorProfiles
    * @instance
    */
    loadColorProfileNames(callback) {
        this.dao.loadColorProfiles(this, callback);
    }

    /** Updates current selected color profile.
    * @method updateColorProfile
    * @param {Map} colors Word-to-Color HashMap
    * @param {Number} sPercentage Saturation settings
    * @param {Number} lPercentage Lightness settings
    * @param {Function} callback Callback function
    * @memberof module:profiles.ColorProfiles
    * @instance
    */
    updateColorProfile(...args) {
        let colorProfile = null;
        let clb = null;
        if (args.length > 3) {
            const [colors, sPercentage, lPercentage, callback] = [...args];
            colorProfile = new __WEBPACK_IMPORTED_MODULE_0__ColorProfile__["a" /* default */](this.loadedProfile.name,
            colors, sPercentage, lPercentage);
            clb = callback;
        } else if (args.length < 3) {
            const [profile, callback] = [...args];
            colorProfile = profile;
            clb = callback;
        }
        if (colorProfile && colorProfile.name) {
            this.dao.updateColorProfile(colorProfile, () => {
                if (this.loadedProfile && colorProfile.name === this.loadedProfile.name) {
                    this.loadColorProfile(this.loadedProfile.name, clb);
                } else if (clb) {
                    clb();
                }
            });
        }
    }

    /** Deletes color profile from client database.
    * @method deleteColorProfile
    * @param {String} name Name of color profile
    * @param {Function} callback Callback function
    * @memberof module:profiles.ColorProfiles
    * @instance
    */
    deleteColorProfile(name, callback) {
        if (name) {
            const loadedProfileName = this.loadedProfile ? this.loadedProfile.name : null;
            this.dao.deleteColorProfile(name, () => {
                this._removeColorProfileName(name);
                if (name === loadedProfileName) {
                    const profileName = this.profileNames.length > 0 ?
                    this.profileNames[0] : null;
                    if (profileName) {
                        this.loadColorProfile(profileName, callback);
                    } else {
                        this.loadedProfile = null;
                        callback();
                    }
                } else {
                    callback();
                }
            });
        }
    }

    _removeColorProfileName(name) {
        let index;
        for (let i = 0; i < this.profileNames.length; i++) {
            if (this.profileNames[i] === name) {
                index = i;
                break;
            }
        }
        this.profileNames.splice(index, 1);
    }

    _addColorProfileName(name) {
        this.profileNames.push(name);
    }
}

/* harmony default export */ __webpack_exports__["a"] = (ColorProfiles);


/***/ }),
/* 62 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ColorProfile__ = __webpack_require__(3);


/**
* Data Access Object for saving and loading color profiles from
* client database.
* @constructor
* @param {Service} dbService - 'db' service
* @param {Service} colorService - 'colorService' service
* @memberof module:profiles
*/
class ColorProfilesDAO {

    constructor(dbService, colorService) {
        this.colorFactory = colorService;
        this.store = 'colorprofiles';
        this.db = dbService;
    }

    /** Loads color profile from client database.
    * @method loadColorProfile
    * @param {String} name Name of color profile
    * @param {Function} callback Callback function
    * @memberof module:profiles.ColorProfilesDAO
    * @instance
    */
    loadColorProfile(name, callback) {
        if (name) {
            this.db.getStore(this.store)
            .getItem(name)
            .then((item) => {
                if (item) {
                    const profile = __WEBPACK_IMPORTED_MODULE_0__ColorProfile__["a" /* default */].deserialize(item, this.colorFactory, this.db);
                    callback(profile);
                }
            })
            .catch((e) => {
                console.error(e);
            });
        }
    }

    /** Deletes color profile from client database. 
    * @method deleteColorProfile
    * @param {String} name Name of color profile
    * @param {Function} callback Callback function
    * @memberof module:profiles.ColorProfilesDAO
    * @instance
    */
    deleteColorProfile(name, callback) {
        if (name) {
            this.db.getStore(this.store)
            .removeItem(name)
            .then(() => {
                if (callback) {
                    callback();
                }
            })
            .catch((e) => {
                console.error(e);
            });
        }
    }

    /** Save color profile in client database.
    * @method saveColorProfile
    * @param {ColorProfile} profile Color profile
    * @param {ColorProfiles} profiles Color profiles model
    * @param {Function} callback Callback function
    * @memberof module:profiles.ColorProfilesDAO
    * @instance
    */
    saveColorProfile(profile, profiles, callback) {
        if (profile && profile.name) {
            const store = this.db.getStore(this.store);
            store.getItem(profile.name)
            .then((item) => {
                if (!item) {
                    return store.setItem(profile.name, profile.serialize())
                    .then(() => {
                        profiles._addColorProfileName(profile.name);
                        if (callback) {
                            callback();
                        }
                    });
                }
                return null;
            })
            .catch((e) => {
                console.error(e);
            });
        }
    }

    /** Load names of existing color profiles.
    * @method loadColorProfiles
    * @param {ColorProfiles} profiles Color profiles model
    * @param {Function} callback Callback function
    * @memberof module:profiles.ColorProfilesDAO
    * @instance
    */
    loadColorProfiles(profiles, callback) {
        this.db.getStore(this.store)
        .iterate((value, key) =>
            profiles._addColorProfileName(key))
        .then(() => {
            if (callback) {
                callback();
            }
        })
        .catch((e) => {
            console.error(e);
        });
    }

    /** Updates color profile.
    * @method updateColorProfile
    * @param {ColorProfile} profile Color profile with new values
    * @param {Function} callback Callback function
    * @memberof module:profiles.ColorProfilesDAO
    * @instance
    */
    updateColorProfile(profile, callback) {
        if (profile && profile.name) {
            this.db.getStore(this.store)
            .setItem(profile.name, profile.serialize())
            .then(() => {
                if (callback) {
                    callback();
                }
            })
            .catch((e) => {
                console.error(e);
            });
        }
    }
}

/* harmony default export */ __webpack_exports__["a"] = (ColorProfilesDAO);


/***/ }),
/* 63 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_color_profiles_scss__ = __webpack_require__(64);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_color_profiles_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__scss_color_profiles_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_color_profiles_html__ = __webpack_require__(65);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_color_profiles_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__template_color_profiles_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__classes_Utils__ = __webpack_require__(66);




const colorProfilesCompName = 'colorProfiles';
/* harmony export (immutable) */ __webpack_exports__["b"] = colorProfilesCompName;

const colorProfilesComp = {
    template: __WEBPACK_IMPORTED_MODULE_1__template_color_profiles_html___default.a,
    bindings: {
        colors: '<',
        onLoadProfile: '&',
    },
    controller: class ColorProfilesCtrl {
        static get $inject() {
            return ['$rootScope', '$scope', '$timeout', 'colorProfiles', 'colorService', 'textColors', 'popupDialog'];
        }

        constructor($rootScope, $scope, $timeout, colorProfiles,
            colorService, textColors, dialog) {
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this._colorService = colorService;
            this._textColors = textColors;
            this._dialog = dialog;
            this._mode = "";
            this._utils = new __WEBPACK_IMPORTED_MODULE_2__classes_Utils__["a" /* default */]();
            this._singleColors = [];
            this.colorProfiles = colorProfiles;
            this.openCreateProfile = false;
            this.openConflicts = false;
            this.newProfileName = "";
            this.colorProfiles = colorProfiles;
            this.conflictColors = [];

            this.$scope.$on("colorsChainged", () => {
                this.$timeout(() => {
                    const profile = this.colorProfiles.loadedProfile;
                    if (profile) {
                        this._checkColorConflicts(profile.colors);
                        this.$scope.$apply();
                    }
                }, 0, false);
            });
        }

        $onInit() {
            this.colorProfiles.init(() => {
                this.$scope.$apply();
            });
        }

        updateProfileDialog() {
            const self = this;
            this._resetColorConflicts();
            if (this.colorProfiles.loadedProfile) {
                this._dialog.confirmDialog(function () {
                    this.yes = () => {
                        self.updateProfile();
                        self._dialog.close();
                    };
                    this.cancel = () => {
                        self._dialog.close();
                    };
                    this.title = '"update profile"';
                });
            }
        }

        applyProfileDialog() {
            const self = this;
            if (this.colorProfiles.loadedProfile) {
                this._dialog.confirmDialog(function () {
                    this.yes = () => {
                        self.applyProfile();
                        self._dialog.close();
                    };
                    this.cancel = () => {
                        self._dialog.close();
                    };
                    this.title = '"apply profile"';
                });
            }
        }

        deleteProfileDialog() {
            const self = this;
            if (this.colorProfiles.loadedProfile) {
                this._dialog.confirmDialog(function () {
                    this.yes = () => {
                        self.deleteProfile();
                        self._dialog.close();
                    };
                    this.cancel = () => {
                        self._dialog.close();
                    };
                    this.title = '"delete profile"';
                });
            }
        }

        toggleNewProfile() {
            this.openCreateProfile = !this.openCreateProfile;
        }

        haveProfiles() {
            return this.colorProfiles.profileNames.length > 0;
        }

        selectProfile() {
            if (this.colorProfiles.loadedProfile) {
                this.colorProfiles.loadColorProfile(this.colorProfiles.loadedProfile.name);
            }
        }

        saveProfile() {
            const name = this.newProfileName;
            this._resetColorConflicts();
            this._mode = "create";
            if (name && name.trim().length > 0) {
                this._checkColorConflicts();
                if (this.conflictColors.length < 1) {
                    const colors = this._utils.convertColorArrayToMap(this._singleColors);
                    this.createColorProfile(name, colors);
                } else {
                    this.openConflicts = true;
                }
            }
        }

        applyProfile() {
            const profile = this.colorProfiles.loadedProfile;
            this._resetColorConflicts();
            if (profile && profile.name) {
                this.onLoadProfile({
                    colors: profile.colors,
                    sPercentage: profile.sPercentage,
                    lPercentage: profile.lPercentage,
                });
            }
        }

        updateProfile() {
            const profile = this.colorProfiles.loadedProfile;
            this._mode = "update";
            if (profile) {
                this._checkColorConflicts(profile.colors);
                this.openConflicts = this.conflictColors.length > 0;
                if (this.conflictColors.length < 1) {
                    const colors = this._utils.convertColorArrayToMap(this._singleColors);
                    this.updateColorProfile(profile.name, colors);
                }
            }
        }

        deleteProfile() {
            const profile = this.colorProfiles.loadedProfile;
            this.colorProfiles.deleteColorProfile(profile.name, () => {
                this.$scope.$apply();
                this.$rootScope.$broadcast("profilesUpdated");
            });
        }

        solveColorConflicts() {
            const colors = this._utils
            .concatColorArraysToMap(this.conflictColors, this._singleColors);
            switch (this._mode) {
                case 'update': {
                    const name = this.colorProfiles.loadedProfile.name;
                    if (name && colors.size > 0) {
                        this.updateColorProfile(name, colors);
                        this._resetColorConflicts();
                        this._mode = "";
                    }
                } break;
                case 'create': {
                    const name = this.newProfileName;
                    if (name) {
                        this.createColorProfile(name, colors);
                        this._resetColorConflicts();
                        this._mode = "";
                    }
                } break;
                default: break;
            }
        }

        abortSolveColorConflicts() {
            this.openConflicts = false;
        }

        createColorProfile(name, colors) {
            for (const [word, color] of colors) {
                if (!color.isSet()) {
                    colors.delete(word);
                }
            }
            this.colorProfiles.createColorProfile(name, colors,
            this._textColors.sPercentage, this._textColors.lPercentage, () => {
                this.newProfileName = "";
                this.colorProfiles.loadColorProfile(name, () => {
                    this.openCreateProfile = false;
                    this.$scope.$apply();
                });
            });
        }

        updateColorProfile(name, colors) {
            for (const [word, color] of colors) {
                if (!color.isSet()) {
                    colors.delete(word);
                }
            }
            this.colorProfiles.updateColorProfile(colors, this._textColors.sPercentage,
                this._textColors.lPercentage, () => {
                this._resetColorConflicts();
                this.$timeout(() => {
                    this.$rootScope.$broadcast("profilesUpdated");
                }, 0, false);
            });
        }

        _resetColorConflicts() {
            this.conflictColors = [];
            this._singleColors = [];
            this.openConflicts = false;
        }

        _checkColorConflicts(colors) {
            this._resetColorConflicts();
            const colorsMapTemp = new Map();
            for (const [word, mapColors] of this.colors) {
                const colorsArray = mapColors.getValuesArray();
                const colorSet = this._colorService.getColorSetInstance();
                for (let i = 0; i < colorsArray.length; i++) {
                    colorSet.add(colorsArray[i]);
                }
                colorsMapTemp.set(word, colorSet);
            }

            if (colors) {
                for (const [word, color] of colors) {
                    const c = this._colorService.getColorInstance(color);
                    const entry = colorsMapTemp.get(word);
                    if (entry) {
                        entry.add(c);
                    } else {
                        const colorSet = this._colorService.getColorSetInstance();
                        colorSet.add(c);
                        colorsMapTemp.set(word, colorSet);
                    }
                }
            }

            for (const [word, mapColors] of colorsMapTemp) {
                const colorsToWordArray = mapColors.getValuesArray();
                if (colorsToWordArray.length > 1) {
                    const sel = colorsToWordArray[0];
                    this.conflictColors.push({ word, selected: sel, colors: colorsToWordArray });
                } else {
                    const color = colorsToWordArray[0];
                    this._singleColors.push({ word, color });
                }
            }
        }
    },
};
/* harmony export (immutable) */ __webpack_exports__["a"] = colorProfilesComp;



/***/ }),
/* 64 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = "<div class=\"color-profiles\">\n    <select class=\"color-profiles__profiles\" ng-change=\"$ctrl.selectProfile()\" ng-model=\"$ctrl.colorProfiles.loadedProfile.name\">\n        <option ng-show=\"$ctrl.colorProfiles.profileNames.length < 1\" value =\"\">Select profile...</option>\n        <option ng-repeat=\"profileName in $ctrl.colorProfiles.profileNames\" value=\"{{profileName}}\">{{profileName}}</option>\n    </select>\n    <div class=\"color-profiles__controls\">\n        <a ng-click=\"$ctrl.applyProfileDialog()\" class=\"btn-bodyless btn-bodyless-primary\" ng-class=\"$ctrl.haveProfiles() ? '' : 'disabled'\"><span class=\"glyphicon glyphicon-tint\"></span> Apply</a>\n        <a ng-click=\"$ctrl.updateProfileDialog()\" class=\"btn-bodyless\" ng-class=\"$ctrl.haveProfiles() ? '' : 'disabled'\"><span class=\"glyphicon glyphicon-floppy-save\"></span> Update</a>\n        <a ng-click=\"$ctrl.toggleNewProfile()\" class=\"btn-bodyless btn-bodyless-success\"><span class=\"glyphicon glyphicon-plus\" aria-hidden=\"true\"></span> New</a>\n        <a ng-click=\"$ctrl.deleteProfileDialog()\" class=\"btn-bodyless btn-bodyless-danger\"  ng-class=\"$ctrl.haveProfiles() ? '' : 'disabled'\"><span class=\"glyphicon glyphicon-trash\"></span> Drop</a>\n    </div>\n    <div ng-show=\"$ctrl.openCreateProfile\" class=\"color-profiles__create-profile\">\n        <input ng-model=\"$ctrl.newProfileName\" type=\"text\" class=\"form-control create-profile__profile-name\" placeholder=\"Profile\">\n        <a ng-click=\"$ctrl.saveProfile()\" class=\"btn btn-success btn-block color-profiles__save-profile\"><span class=\"glyphicon glyphicon-save\" aria-hidden=\"true\"></span> Save</a>\n    </div>\n    <div ng-show=\"$ctrl.openConflicts\" class=\"color-profiles__conflicts\">\n        <div class=\"color-profiles__conflict-title\"><span> Resolve conflicts</span></div>\n        <ul class=\"color-profiles__conflict-colors\">\n            <li ng-repeat=\"item in $ctrl.conflictColors track by $index\">\n            {{item.word}}\n                <form>\n                    <div class=\"radio\" ng-repeat=\"color in item.colors track by $index\">\n                        <label><input  ng-model=\"$ctrl.conflictColors[$parent.$index].selected\" ng-value=\"color\" type=\"radio\"><span ng-show=\"color.isSet()\" class=\"color-profiles__conflict-color\" ng-style=\"{'background-color': color}\"></span><span ng-show=\"color.isSet()\" class=\"color-profile__conflict-weight\"> weight: {{color.weight}}</span><span ng-show=\"!color.isSet()\"> none</span></label>\n                    </div>\n                </form>\n            </li>\n        </ul>\n        <a ng-click=\"$ctrl.solveColorConflicts()\" class=\"btn btn-success\"><span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span> OK</a>\n        <a ng-click=\"$ctrl.abortSolveColorConflicts()\" class=\"btn btn-danger\"><span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span> Cancel</a>\n    </div>\n</div>\n";

/***/ }),
/* 66 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Utils {

    concatColorArraysToMap(conflictColors, singleColors) {
        let colors = [];
        conflictColors.forEach((item) => {
            colors.push({ word: item.word, color: item.selected });
        });
        colors = colors.concat(singleColors);
        const colorMap = this.convertColorArrayToMap(colors);
        return colorMap;
    }

    convertColorArrayToMap(arr) {
        const colorMap = new Map();
        for (let i = 0, k = arr.length; i < k; i++) {
            colorMap.set(arr[i].word, arr[i].color);
        }
        return colorMap;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Utils;



/***/ }),
/* 67 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_profiles_viewer_scss__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_profiles_viewer_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__scss_profiles_viewer_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_profiles_viewer_html__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_profiles_viewer_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__template_profiles_viewer_html__);



const profilesViewerCompName = 'profilesViewer';
/* harmony export (immutable) */ __webpack_exports__["b"] = profilesViewerCompName;

const profilesViewerComp = {
    template: __WEBPACK_IMPORTED_MODULE_1__template_profiles_viewer_html___default.a,
    controller: class ProfilesViewerCtrl {
        static get $inject() {
            return ['$scope', '$timeout', 'colorProfiles', 'colorService', 'popupDialog', 'usSpinnerService'];
        }

        constructor($scope, $timeout, colorProfiles, colorService, dialog, spinner) {
            this.$scope = $scope;
            this.$timeout = $timeout;
            this._colorService = colorService;
            this._dialog = dialog;
            this._spinner = spinner;
            this._step = 10;
            this._showIndex = 0;
            this._wordsAndColors = [];
            this.colorProfiles = colorProfiles;
            this.words = [];
            this.profileName = "";
            this.selectedProfile = null;
            this.searchWord = "";
            this.foundWord = null;
            this.selectedWord = null;

            this.$scope.$watch("$ctrl.searchWord", (newValue, oldValue) => {
                    if (newValue !== oldValue) {
                        this.findWordAndColor(newValue);
                    }
                },
            );

            this.$scope.$on("profilesUpdated", () => {
                if (this.selectedProfile) {
                    this.loadColorProfile(true);
                }
            });
        }

        loadColorProfile(update) {
            this._showIndex = update === true ? this._showIndex : 0;
            this._wordsAndColors = [];
            this.words = [];
            this.selectedProfile = null;
            this.selectedWord = null;
            this.colorProfiles.getColorProfile(this.profileName, (profile) => {
                this.selectedProfile = profile;
                const profileColors = [];
                for (const [word, color] of profile.colors) {
                    const adjustedColor = this._colorService.getColorInstance(color);
                    adjustedColor.interpolateS(profile.sPercentage).interpolateL(profile.lPercentage);
                    profileColors.push({ word, color: adjustedColor, type: "word" });
                }
                profileColors.sort((a, b) => {
                    if (a.word > b.word) {
                        return 1;
                    }
                    if (a.word < b.word) {
                        return -1;
                    }
                    return 0;
                });
                for (let i = 0, k = profileColors.length; i < k; i++) {
                    const current = profileColors[i];
                    const next = profileColors[i + 1];
                    let added = false;
                    if (i === 0) {
                        this._wordsAndColors.push({ word: current.word.charAt(0).toUpperCase(), type: "title" });
                        this._wordsAndColors.push(current);
                        added = true;
                    }
                    if (next && next.word.charAt(0) !== current.word.charAt(0)) {
                        if (!added) {
                            this._wordsAndColors.push(current);
                        }
                        this._wordsAndColors.push({ word: next.word.charAt(0).toUpperCase(), type: "title" });
                        added = true;
                    }
                    if (!added) {
                        this._wordsAndColors.push(current);
                    }
                }
                this.words = update === true ? this._wordsAndColors.slice(0, this._showIndex) :
                this._wordsAndColors.slice(0, this._step);
                this._showIndex += this._step;
                this.findWordAndColor(this.searchWord);
                this.$scope.$apply();
            });
        }

        findWordAndColor(word) {
            if (this.selectedProfile && this.selectedProfile.name) {
                const color = this.selectedProfile.getColor(word);
                if (color) {
                const adjustedColor = this._colorService.getColorInstance(color);
                adjustedColor.interpolateS(this.selectedProfile.sPercentage)
                .interpolateL(this.selectedProfile.lPercentage);
                this.foundWord = { word, color: adjustedColor };
                } else {
                    this.foundWord = null;
                }
            } else {
                this.foundWord = null;
            }
        }

        showMore() {
            this.words = this.words
            .concat(this._getWordsInInterval(this._showIndex,
            this._showIndex + this._step, this._wordsAndColors));
            this._showIndex += this._step;
        }

        clickHandler($event) {
            const target = $event.target;
            if (target.hasAttribute("word")) {
                $event.stopPropagation();
                const word = target.getAttribute("word");
                this.selectedWord = this.selectedWord === word ? null : word;
            } else if (target.hasAttribute("delete")) {
                $event.stopPropagation();
                const word = target.getAttribute("delete");
                this.deleteWordDialog(word);
            }
        }

        deleteWordDialog(word) {
            const self = this;
            this._dialog.confirmDialog(function () {
                this.yes = () => {
                    self.deleteWord(word);
                    self._dialog.close();
                };
                this.cancel = () => {
                    self._dialog.close();
                };
                this.title = '"delete word"';
            });
        }

        deleteWord(word) {
            this.selectedProfile.deleteWord(word);
            this.colorProfiles.updateColorProfile(this.selectedProfile, () => {
                this.foundWord = null;
                this.searchWord = "";
                this.loadColorProfile(true);
            });
        }

        countProfileWords() {
            return (this.selectedProfile && this.selectedProfile.countWords) ?
            this.selectedProfile.countWords() : 0;
        }

        _getWordsInInterval(start, end, words) {
            if (start >= 0 && start < words.length) {
                if (end > words.length) {
                    end = words.length;
                }
                return words.slice(start, end);
            }
            return [];
        }
    },
};
/* harmony export (immutable) */ __webpack_exports__["a"] = profilesViewerComp;



/***/ }),
/* 68 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = "<div class=\"profiles-viewer\">\r\n    <h4>Profiles archive</h4>\r\n    <select class=\"profiles-viewer__profiles\" ng-change=\"$ctrl.loadColorProfile()\" ng-model=\"$ctrl.profileName\">\r\n        <option ng-show=\"$ctrl.colorProfiles.profileNames.length < 1\" value =\"\" selected>Select profile...</option>\r\n        <option ng-repeat=\"profile in $ctrl.colorProfiles.profileNames\" data-colorprofiles-profile=\"{{$index}}\" value=\"{{profile}}\">{{profile}}</option>\r\n    </select>\r\n    <div class=\"profiles-viewer__search\">\r\n        <input class=\"profiles-viewer__search-input\" type=\"text\" ng-model=\"$ctrl.searchWord\" placeholder=\"search by word...\">\r\n    </div>\r\n    <h5 ng-show=\"$ctrl.selectedProfile\">Total: {{$ctrl.countProfileWords()}} {{$ctrl.countProfileWords() > 1 ? \"words\" : \"word\"}}</h6>\r\n    <div ng-show=\"!$ctrl.foundWord\" ng-click=\"$ctrl.clickHandler($event)\" class=\"profiles-viewer__words\" infinite-scroll='$ctrl.showMore()' infinite-scroll-distance='0'>\r\n        <div ng-repeat=\"word in $ctrl.words track by word.word\" class=\"profiles-viewer__section\">\r\n            <span ng-show=\"$ctrl.selectedWord === word.word\" class=\"glyphicon glyphicon-remove profiles-viewer__delete\" ng-attr-delete=\"{{$ctrl.selectedWord === word.word ? word.word : undefined}}\"></span>\r\n            <div ng-class=\"{'profiles-viewer__section-title': word.type === 'title', 'profiles-viewer__section-word': word.type === 'word'}\" ng-attr-word=\"{{word.type === 'word' ? word.word : undefined}}\">{{word.word}}</div>\r\n            <div ng-show=\"word.type === 'word'\" class=\"profiles-viewer__space\"></div>\r\n            <div ng-show=\"word.type === 'word'\" class=\"profiles-viewer__color\" ng-style=\"{'background-color': word.color}\"></div>\r\n        </div>\r\n    </div>\r\n    <div ng-click=\"$ctrl.clickHandler($event)\" ng-show=\"$ctrl.foundWord\" class=\"profiles-viewer__search-result profiles-viewer__section\">\r\n        <span ng-show=\"$ctrl.selectedWord === $ctrl.foundWord.word\" class=\"glyphicon glyphicon-remove profiles-viewer__delete\" ng-attr-delete=\"{{$ctrl.foundWord.word}}\"></span>\r\n        <div class=\"profiles-viewer__section-word\" ng-attr-word=\"{{$ctrl.foundWord.word}}\">{{$ctrl.foundWord.word}}</div>\r\n        <div class=\"profiles-viewer__space\"></div>\r\n        <div class=\"profiles-viewer__color\" ng-style=\"{'background-color': $ctrl.foundWord.color}\"></div>\r\n    </div>\r\n</div>";

/***/ }),
/* 70 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = "<span us-spinner=\"{position: 'fixed', color: '#428bca'}\" spinner-key=\"spinner-1\"></span>     \r\n<div class=\"color-search__content\">   \r\n    <div class=\"color-search__header\">\r\n        <div ng-click=\"$ctrl.goToMain()\" class=\"color-search__logo\"><div class=\"color-search__logo-image\"></div></div>\r\n        <div class=\"color-search__navigation\">\r\n            <a class=\"btn-bodyless btn-bodyless-default\" ng-click=\"$ctrl.goToGuide()\">Guide</a><span class=\"color-search__separator\"></span>\r\n            <a class=\"btn-bodyless btn-bodyless-default\" ng-click=\"$ctrl.goToSettings()\">Archive</a>\r\n        </div>\r\n    </div>\r\n    <ui-view name = \"pages\">\r\n        <main ng-show=\"$ctrl.page == 'main'\"></main> \r\n        <guide ng-show=\"$ctrl.page == 'guide'\"></guide>  \r\n        <profiles-viewer ng-show=\"$ctrl.page === 'profiles'\"></profiles-viewer>  \r\n    </ui-view>\r\n</div>\r\n";

/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_md5__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_md5___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_md5__);


/**
* Login model. Implements user login business logic.
* @constructor:
* @param {Service} $q Angularjs '$q' service
* @param {Service} jsonrpc 'jsonrpc' service
* @memberof module:color-search
*/
class Login {

    constructor($q, jsonrpc) {
        this.required = null;
        this.auth = null;
        this.success = false;
        this.password = null;
        this.jsonrpc = jsonrpc;
        this.$q = $q;
    }

    /** Check if login data exists.
    * @method isSet
    * @return {boolean}
    * @memberof module:color-search.Login
    * @instance
    */
    isSet() {
        return this.password !== null;
    }

    /** Checks if login was successful.
    * @method isSuccessful
    * @return {boolean}
    * @memberof module:color-search.Login
    * @instance
    */
    isSuccessful() {
        return this.auth !== null && this.success;
    }

    /** Sends server login request.
    * @method login
    * @memberof module:color-search.Login
    * @instance
    */
    login() {
        const self = this;
        const auth = __WEBPACK_IMPORTED_MODULE_0_md5___default()(`${this.password}`);
        return this.jsonrpc.request('login', { login: auth })
        .then((data) => {
            if (data.success) {
                self.auth = auth;
                this.success = true;
                return true;
            }
            return false;
        });
    }

    /** Sends server request and checks if login is requered.
    * @method isRequired
    * @memberof module:color-search.Login
    * @instance
    */
    isRequired() {
        if (this.required) {
            return this.$q.resolve(true);
        }
        return this.jsonrpc.request('loginRequired', {})
        .then((data) => {
            this.required = data.required;
            return this.required;
        });
    }
}

/* harmony default export */ __webpack_exports__["a"] = (Login);


/***/ }),
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_dialog_scss__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scss_dialog_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__scss_dialog_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__templates_confirm_html__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__templates_confirm_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__templates_confirm_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__templates_login_html__ = __webpack_require__(79);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__templates_login_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__templates_login_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__templates_error_html__ = __webpack_require__(80);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__templates_error_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__templates_error_html__);





/**
* Module for creating dialogs
* @module dialog
*/
angular.module('dialog', [])
/** Service for creating pop-up dialogs on-the-fly
* @member {Service} popupDialog
* @memberof module:dialog
* @instance
*/
.service('popupDialog', ['$rootScope', '$compile',
function ($rootScope, $compile) {
    let scope = null;
    let element = null;
    const self = this;

    function create(template, Control, closeByOutside) {
        const html = `<div class="dialog" ng-click="close($event)">
        <div class="dialog__window">${template}</div></div>`;
        scope = $rootScope.$new(true);
        scope.$ctrl = new Control();
        scope.closeByOutside = closeByOutside;
        scope.close = ($event) => {
            const target = angular.element($event.target);
            if (target.hasClass("dialog") && scope.closeByOutside) {
                self.close();
            }
        };
        const compiled = $compile(html)(scope);
        element = angular.element(compiled).appendTo("body");
    }

    this.close = () => {
        if (element && scope) {
            element.remove();
            scope.$destroy();
            element = null;
            scope = null;
            angular.element("*").removeAttr("tabindex");
        }
    };

    this.errorDialog = (Control) => {
        this.close();
        angular.element("*").attr("tabindex", -1);
        angular.element("*").blur();
        create(__WEBPACK_IMPORTED_MODULE_3__templates_error_html___default.a, Control, false);
    };

    this.confirmDialog = (Control) => {
        this.close();
        angular.element("*").attr("tabindex", -1);
        angular.element("*").blur();
        create(__WEBPACK_IMPORTED_MODULE_1__templates_confirm_html___default.a, Control, true);
    };

    this.loginDialog = (Control) => {
        this.close();
        angular.element("*").attr("tabindex", -1);
        angular.element("*").blur();
        create(__WEBPACK_IMPORTED_MODULE_2__templates_login_html___default.a, Control, false);
    };
}]);

/* harmony default export */ __webpack_exports__["a"] = ("dialog");


/***/ }),
/* 77 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 78 */
/***/ (function(module, exports) {

module.exports = "<div class=\"confirm-dialog\">\r\n    <h4><span class=\"glyphicon glyphicon-question-sign\"></span> Confirm <span class=\"confirm-dialog__title\">{{$ctrl.title}}</span></h4>\r\n    <p>Are you sure you want to proceed?</p>\r\n    <div style=\"float: right;\">\r\n        <a class=\"btn btn-danger\" ng-click=\"$ctrl.cancel()\">Cancel</a> \r\n        <a class=\"btn btn-success\" ng-click=\"$ctrl.yes()\">Yes</a>\r\n    </div><div style=\"clear: both;\"></div>    \r\n</div>";

/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = "<div class=\"login-dialog\">\r\n    <div class=\"form-group\"><input ng-model=\"$ctrl.model.password\" type=\"password\" class=\"form-control\" placeholder=\"Password\"></div>\r\n    <a ng-click=\"$ctrl.login()\" class=\"btn btn-success btn-block\"><span class=\"glyphicon glyphicon-cloud-upload\" aria-hidden=\"true\"></span> Log in</a>\r\n</div>";

/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = "<div class=\"error-dialog\">\r\n    <h4><span class=\"glyphicon glyphicon-warning-sign\"></span>  {{$ctrl.title}}</h4>\r\n    <p>{{$ctrl.description}}</p>\r\n    <a ng-show=\"$ctrl.button\" ng-click=\"$ctrl.handle()\" class=\"btn btn-danger btn-block\"><span ng-show=\"$ctrl.icon\" ng-class=\"'glyphicon glyphicon-{{$ctrl.icon}}'\"></span> {{$ctrl.buttonTitle}}</a>\r\n</div>";

/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_localforage__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_localforage___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_localforage__);

/**
* Abstracts client database technology from application.
* Uses 'localforage' library, which supports INDEXEDDB, WEBSQL and LOCALSTORAGE.
* @module db
* @requires localforage
*/
angular.module('db', [])
/** Service which returns 'store' object of configurated database.
* @member {Service} db
* @memberof module:db
* @instance
*/
.service('db', [function () {
    __WEBPACK_IMPORTED_MODULE_0_localforage___default.a.config({
        driver: [__WEBPACK_IMPORTED_MODULE_0_localforage___default.a.INDEXEDDB,
                __WEBPACK_IMPORTED_MODULE_0_localforage___default.a.WEBSQL,
                __WEBPACK_IMPORTED_MODULE_0_localforage___default.a.LOCALSTORAGE],
        name: 'ColorSearch',
        version: 1.0,
    });
    this.getStore = store => __WEBPACK_IMPORTED_MODULE_0_localforage___default.a.createInstance({ name: 'ColorSearch', storeName: store });
}]);

/* harmony default export */ __webpack_exports__["a"] = ("db");


/***/ })
],[5]);