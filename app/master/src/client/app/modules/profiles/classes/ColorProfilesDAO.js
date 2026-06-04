import ColorProfile from "./ColorProfile";

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
                    const profile = ColorProfile.deserialize(item, this.colorFactory, this.db);
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

export default ColorProfilesDAO;
