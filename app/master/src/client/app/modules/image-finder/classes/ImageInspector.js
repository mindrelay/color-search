/**
* Inspects flickr images and decides if an image could be faulty.
* Calls user callback if the image is suspicious.
* @constructor FlickrInspectingStrategy
* @memberof module:image-finder
*/
class FlickrInspectingStrategy {

    constructor() {
        this._errorWidth = [320, 500];
        this._errorHeight = [240, 374];
    }

    /** Inspects one element and call callback function if
    * image tend to be faulty.
    * @method inspect
    * @param {Object} elem {imageNode: DOMnode, image: Image, callback: Function}
    * @memberof module:image-finder.FlickrInspectingStrategy
    * @instance
    */
    inspect(elem) {
        const width = elem.imageNode.naturalWidth;
        const height = elem.imageNode.naturalHeight;
        if ((width === this._errorWidth[0] && height === this._errorHeight[0]) ||
            (width === this._errorWidth[1] && height === this._errorHeight[1])) {
            if (elem.callback) {
                elem.callback(elem.image, elem.imageNode);
            }
        }
    }
}

/**
* Batch for loaded images, which must be inspected.
* @constructor InspectingBatch
* @param {$window} $window Angularjs '$window' service
* @param {$document} $document Angularjs '$document' service
* @param {Map} strategies HashMap with inspecting strategies
* @param {number} portion Portion of images which will be inspected in one step
* @memberof module:image-finder
*/
class InspectingBatch {

    constructor($window, $document, strategies, portion) {
        this._imagesToInspect = [];
        this._strategies = strategies;
        this._portion = portion;
        this.$window = $window;
        setInterval(this._inspect.bind(this), 500);
    }

    /** Size of the batch
    * @method size
    * @return {Number}
    * @memberof module:image-finder.InspectingBatch
    * @instance
    */
    size() {
        return this._imagesToInspect.length;
    }

    /** Adds one element into batch.
    * @method add
    * @param {Object} element {imageNode: DOMnode, image: Image, callback: Function}
    * @memberof module:image-finder.InspectingBatch
    * @instance
    */
    add(element) {
        this._imagesToInspect.push(element);
    }

    _inspect() {
        const list = this._imagesToInspect.splice(0, this._portion);
        for (const elem of list) {
            const strategy = this._strategies.get(elem.image.source);
            if (strategy) {
                strategy.inspect(elem);
            }
        }
    }
}

/**
* Inspects images for failure
* @constructor
* @param {$window} $window Angularjs '$window' service
* @param {$document} $document Angularjs '$document' service
* @memberof module:image-finder
*/
class ImageInspector {

    constructor($window, $document) {
        const strategies = new Map()
        .set("flickr", new FlickrInspectingStrategy());
        this.batch = new InspectingBatch($window, $document, strategies, 20);
    }

    /** Add element for inspection.
    * @method inspect
    * @param {Image} image Image object
    * @param {Object} imageNode Image DOM node
    * @param {function} callback Callback function will be called, if image tend to be faulty.
    * @memberof module:image-finder.ImageInspector
    * @instance
    */
    inspect(image, imageNode, callback) {
        this.batch.add({ image, imageNode, callback });
    }
}

export default ImageInspector;
