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

export default TextColors;
