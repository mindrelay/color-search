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

export default HSLColor;
