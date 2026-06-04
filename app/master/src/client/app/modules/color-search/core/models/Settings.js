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

export default Settings;
