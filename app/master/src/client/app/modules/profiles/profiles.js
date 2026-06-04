import scroll from 'ng-infinite-scroll';
import ColorProfiles from "./classes/ColorProfiles";
import { colorProfilesCompName, colorProfilesComp } from "./color-profiles/color-profiles";
import { profilesViewerCompName, profilesViewerComp } from "./profiles-viewer/profiles-viewer";

/**
* Module for color profiles
* @module profiles
* @requires module:ng-infinite-scroll
*/
angular.module('profiles', [scroll])
/** Color profiles model.
* @member {Service} colorProfiles
* @memberof module:profiles
* @see ColorProfiles class
* @instance
*/
.service('colorProfiles', ['db', 'colorService', function (dbService, colorService) {
    return new ColorProfiles(dbService, colorService);
}])
/** Color profiles component. Used to create, update and load of color profiles.
* @member {Component} colorProfiles
* @property {ColorProfilesCtrl} controller
* @property {String} template
* @memberof module:profiles
* @instance
*/
.component(colorProfilesCompName, colorProfilesComp)
/** Color profiles viewer component. Shows color profiles
* which are saved in client database.
* @member {Component} profilesViewer
* @property {ProfilesViewerCtrl} controller
* @property {String} template
* @memberof module:profiles
* @instance
*/
.component(profilesViewerCompName, profilesViewerComp);

export default 'profiles';
