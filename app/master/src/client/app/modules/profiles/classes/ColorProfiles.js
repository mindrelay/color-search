import ColorProfile from "./ColorProfile";
import ColorProfilesDAO from "./ColorProfilesDAO";

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
        this.dao = new ColorProfilesDAO(dbService, colorService);
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
        const profile = new ColorProfile(name, colors, sPercentage, lPercentage);
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
            colorProfile = new ColorProfile(this.loadedProfile.name,
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

export default ColorProfiles;
