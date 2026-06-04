/**
* Sends requests to the server using JsonRPC service.
* Uses Login service for client-server authentication.
* @constructor
* @param {Service} jsonrpc - 'jsonrpc' service
* @param {Service} login - 'login' service
* @memberof module:image-finder
*/
class ImagesRPCService {

    constructor(jsonrpc, login) {
        this.jsonrpc = jsonrpc;
        this.login = login;
    }

    /** Check image for failure. Sends request to the server.
    * @method checkForImageFailure
    * @param {Image} img Object that contains data for image creation
    * @param {Function} callback (optional) Callback function
    * @memberof module:image-finder.ImagesRPCService
    * @instance
    */
    checkForImageFailure(img, callback) {
        this.jsonrpc.request('checkImage', { image: img })
        .then((failure) => {
            if (callback) {
                callback(failure);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    /** Searching for similar images. Sends request to the server.
    * @method findImages
    * @param {Images} images Images model
    * @param {Object} data Object with data for search {colors: HSLImage[], words: string[]}
    * @param {Settings} searchSettings Settings model
    * @param {Function} callback Callback function
    * @memberof module:image-finder.ImagesRPCService
    * @instance
    */
    findImages(images, data, searchSettings, callback) {
        const self = this;
        this.jsonrpc.request('find', { colors: data.colors, words: data.words, settings: searchSettings.serialize(), auth: self.login.auth })
        .then((result) => {
            if (result && result.imgs && result.imgs.length > 0) {
                images.empty();
                for (let i = 0; i < result.imgs.length; i++) {
                    images.addImage(result.imgs[i]);
                }
            }
            result = null;
            if (callback) {
                callback();
            }
        })
        .catch((error) => {
            console.error(error);
            if (callback) {
                callback();
            }
        });
    }
}

export default ImagesRPCService;

