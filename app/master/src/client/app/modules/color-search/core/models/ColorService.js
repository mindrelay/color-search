import Colr from 'colr';
import HSLColor from './HSLColor';
import ColorSet from './ColorSet';

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
        return new HSLColor(o);
    }

    /** Creates new ColorSet instance.
    * @method getColorSetInstance
    * @return {ColorSet}
    * @memberof module:color-search.ColorService
    * @instance
    */
    getColorSetInstance() {
        return new ColorSet();
    }

    /** Converts hsl object into hex string color representation.
    * @method hslToHexString
    * @param {Object} color Object with h,s,l values
    * @return {string}
    * @memberof module:color-search.ColorService
    * @instance
    */
    hslToHexString(color) {
        return Colr.fromHsl(color.h, color.s, color.l).toHex();
    }

    /** Converts hex string color into HSL object.
    * @method hexToHsl
    * @param {string} hex Hex-string
    * @return {HSLColor}
    * @memberof module:color-search.ColorService
    * @instance
    */
    hexToHsl(hex) {
        return Colr.fromHex(hex).toHsl();
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
        return Colr.fromHslObject(color).toRgbObject();
    }

    /** Converts RGB object into hex string.
    * @method rgbToHex
    * @param {Object} color Object with r,g,b values.
    * @return {string}
    * @memberof module:color-search.ColorService
    * @instance
    */
    rgbToHex(color) {
        return Colr.fromRgbObject(color).toHex();
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

export default ColorService;

