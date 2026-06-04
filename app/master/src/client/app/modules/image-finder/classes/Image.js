/**
* Represents image.
* @constructor
* @param {Object} conf Configuration object with image data
* @property {Number} id
* @property {String} url
* @property {String} previewURL
* @property {Number} score
* @property {String} source
* @property {String} title
* @property {String} owner
* @memberof module:image-finder
*/
class Image {
    constructor(conf) {
        this.id = conf.id;
        this.url = conf.url;
        this.previewURL = conf.previewURL;
        this.originalURL = conf.originalURL;
        this.score = parseFloat(conf.score).toFixed(2);
        this.source = conf.source;
        this.title = conf.title || "unknown";
        this.owner = conf.owner || "unknown";
    }
}

export default Image;
