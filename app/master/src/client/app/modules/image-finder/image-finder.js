import scroll from 'ng-infinite-scroll';
import 'ng-error';
import 'ng-load';
import './scss/image-finder.scss';
import template from './template/image-finder.html';
import Images from './classes/Images';
import ImagesRPCService from './classes/ImagesRPCService';
import ImageInspector from './classes/ImageInspector';
import { imageViewerCompName, imageViewerComp } from "./image-viewer/image-viewer";

/**
* Module for image search and result representation.
* Uses 'jsonrpc' module for server connection and scrolling module
* for the on-scroll lazy loading of images.
* @module image-finder
* @requires module:jsonrpc
* @requires module:ng-infinite-scroll
* @requires module:ng-error
* @requires module:ng-load
*/
angular.module('image-finder', ['jsonrpc', scroll, 'ngError', 'ngLoad'])
/** Images model.
* @member {Service} images
* @memberof module:image-finder
* @see Images class
* @instance
*/
.service('images', ['jsonrpc', 'login', function (jsonrpc, login) {
    return new Images(new ImagesRPCService(jsonrpc, login));
}])
/** Image inspector model.
* @member {Service} imageInspector
* @memberof module:image-finder
* @see ImageInspector class
* @instance
*/
.service('imageInspector', ['$window', '$document', 'images', function ($window, $document, images) {
    return new ImageInspector($window, $document, images);
}])
/** Component for image detailed view.
* @member {Component} imageViewer
* @property {ImageViewerCtrl} controller
* @property {String} template
* @property {Object} bindings {image: '<', onClose: '&', onImagesUpdated: '&'}
* @memberof module:image-finder
* @instance
*/
.component(imageViewerCompName, imageViewerComp)
/** Main component of the module.
* Searches for images and represents the search results.
* @member {Component} imageFinder
* @property {ImageFinderCtrl} controller
* @property {String} template
* @property {Object} bindings {onImagesFound: '&', search: '<'}
* @memberof module:image-finder
* @instance
*/
.component('imageFinder', {
    template,
    bindings: {
        onImagesFound: '&',
        search: '<',
    },
    /**
    * Controller for 'imageFinder' component.
    * @constructor ImageFinderCtrl
    * @param {Service} $document Angularjs '$document'
    * @param {Service} images 'images' service
    * @param {Service} imageInspector 'imageInspectro' service
    * @param {Service} usSpinnerService 'usSpinnerService' service
    * @see imageFinder component
    * @memberof module:image-finder
    */
    controller: class ImageFinderCtrl {
        static get $inject() {
            return ['$document', 'images', 'imageInspector', 'usSpinnerService'];
        }

        constructor($document, images, imageInspector, spinner) {
            this.$document = $document;
            this._imageInspector = imageInspector;
            this._spinner = spinner;
            this._step = 10;
            this._images = images;
            this._findPending = false;
            this.selectedImage = null;
            this.imagesToShow = [];
        }

        /** Component hook method
        * @method $onInit
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        $onInit() {
            this.imagesToShow = this._images.getImagesInInterval(0, this._images.showIndex);
        }

        /** Component hook method
        * @method $onChanges
        * @param {Object} changes
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        $onChanges(changes) {
            const search = changes.search.currentValue;
            if (search && !this._findPending) {
                this.imagesToShow.length = 0;
                const wordsAndColors = search.words;
                const settings = search.settings;
                if (settings && wordsAndColors) {
                    this._findPending = true;
                    this._spinner.spin('spinner-1');
                    this._images.findImages(wordsAndColors, settings, () => {
                        this._findPending = false;
                        this._spinner.stop('spinner-1');
                        this.imagesToShow = this._images.getImagesInInterval(0, this._step);
                        this._images.showIndex = this._step;
                        this.onImagesFound({
                            images: this._images.getImagesArray(),
                        });
                    });
                }
            }
        }

        /**
        * @method checkForImageFailure
        * @param {Image} img
        * @param {Object} imgNode Image DOM node
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        checkForImageFailure(img, imgNode) {
            this._images.checkForImageFailure(img, (failure) => {
                if (failure) {
                    this._images.removeImage(img);
                    angular.element(imgNode).remove();
                    this.showMore();
                }
            });
        }

        /** Event handler
        * @method  thumbnailLoaded
        * @param {Object} $event Angularjs '$event'
        * @param {Image} img
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        thumbnailLoaded($event, img) {
            this._imageInspector.inspect(img, $event.target,
            this.checkForImageFailure.bind(this));
        }

        /** Event handler
        * @method thumbnailLoadingError
        * @param {Object} $event Angularjs '$event'
        * @param {Image} img
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        thumbnailLoadingError($event, img) {
            this.checkForImageFailure(img, $event.target);
        }

         /** Show more images on scroll.
        * @method showMore
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        showMore() {
            this.imagesToShow = this.imagesToShow
            .concat(this._images.getImagesInInterval(this._images.showIndex, this._images.showIndex + this._step));
            this._images.showIndex += this._step;
        }

        /** Selects current image. A change of current
        * image will be propagated to the 'imageViewer'
        *  component through bindings. Thus a selected
        * image will be shown in detailed view.
        * @method selectImage
        * @param {Object} $event Angularjs '$event'
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        selectImage($event) {
            const target = $event.target;
            if (target.hasAttribute('imagefinder-image') ||
            angular.element(target).parent()[0].hasAttribute('imagefinder-image')) {
                $event.stopPropagation();
                const id = (target.hasAttribute('imagefinder-image')) ?
                            angular.element(target).attr('imagefinder-image') :
                            angular.element(target).parent().attr('imagefinder-image');
                this.selectedImage = this._images.getImage(id);
            }
        }

        /** Invoked if the result set was updated, for example if some
        * images were removed.
        * @method imagesUpdated
        * @memberof module:image-finder.ImageFinderCtrl
        * @instance
        */
        imagesUpdated() {
            this.imagesToShow = this._images.getImagesInInterval(0, this._images.showIndex);
        }
    },
});

export default 'image-finder';
