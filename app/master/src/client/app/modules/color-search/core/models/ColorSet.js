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

export default ColorSet;
