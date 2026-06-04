import Image from "./Image";

/**
* Images model class.
* Manages images and requests server with the help of 'ImagesRPCService'.
* @constructor:
* @param {ImagesRPCService} service 'ImagesRPCService' instance
* @memberof module:image-finder
*/
class Images {

    constructor(service) {
        this.images = [];
        this.service = service;
        this.showIndex = 0;
    }

    /** Creates new image and adds it to the result set.
    * @method addImage
    * @param {Object} o Object that contains data for image creation
    * @memberof module:image-finder.Images
    * @instance
    */
    addImage(o) {
        const img = new Image(o);
        this.images.push(img);
    }

    /** Removes image from result set.
    * @method removeImage
    * @param {Image} image Image object
    * @memberof module:image-finder.Images
    * @instance
    */
    removeImage(image) {
        for (let i = 0; i < this.images.length; i++) {
            if (this.images[i].id == image.id) {
                this.images.splice(i, 1);
                break;
            }
        }
    }

    /** Returns image by id.
    * @method getImage
    * @param {Number} id Image id
    * @return {Image}
    * @memberof module:image-finder.Images
    * @instance
    */
    getImage(id) {
        let image = null;
        for (let i = 0, k = this.images.length; i < k; i++) {
            if (this.images[i].id == id) {
                image = this.images[i];
                break;
            }
        }
        return image;
    }

    /** Returns all images (result set) as array.
    * @method getImagesArray
    * @return {Image[]}
    * @memberof module:image-finder.Images
    * @instance
    */
    getImagesArray() {
        return this.images;
    }

    /** Number of images in result set.
    * @method count
    * @return {Number}
    * @memberof module:image-finder.Images
    * @instance
    */
    count() {
        return this.images.length;
    }

    /** Returns images from result set in given interval.
    * @method getImagesInInterval
    * @param {Number} start Start index
    * @param {Number} end End index
    * @return {Image[]}
    * @memberof module:image-finder.Images
    * @instance
    */
    getImagesInInterval(start, end) {
        if (start >= 0 && start < this.images.length) {
            if (end > this.images.length) {
                end = this.images.length;
            }
            return this.images.slice(start, end);
        }
        return [];
    }

    /** Deletes all images from result set.
    * @method empty
    * @memberof module:image-finder.Images
    * @instance
    */
    empty() {
        this.images.length = 0;
    }

    /** Checks if the image is faulty.
    * @method checkForImageFailure
    * @param {Image} img Image to check
    * @param {Function} callback Callback function (optional).
    * @memberof module:image-finder.Images
    * @instance
    */
    checkForImageFailure(img, callback) {
        this.service.checkForImageFailure(img, callback);
    }

    /** Search for images.
    * @method findImages
    * @param {Object} data Colors and words.
    * @param {Service} searchSettings Search settings model.
    * @param {Function} callback Callback function.
    * @memberof module:image-finder.Images
    * @instance
    */
    findImages(data, searchSettings, callback) {
        this.empty();
        this.service.findImages(this, data, searchSettings, callback);
    }
}

export default Images;
