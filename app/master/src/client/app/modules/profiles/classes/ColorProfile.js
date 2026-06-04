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

export default ColorProfile;
