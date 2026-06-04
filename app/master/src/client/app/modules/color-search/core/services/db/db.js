import localforage from "localforage";
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
    localforage.config({
        driver: [localforage.INDEXEDDB,
                localforage.WEBSQL,
                localforage.LOCALSTORAGE],
        name: 'ColorSearch',
        version: 1.0,
    });
    this.getStore = store => localforage.createInstance({ name: 'ColorSearch', storeName: store });
}]);

export default "db";
