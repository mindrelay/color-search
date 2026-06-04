import './scss/image-viewer.scss';
import template from './template/image-viewer.html';

export const imageViewerCompName = 'imageViewer';
export const imageViewerComp = {
    template,
    bindings: {
        image: '<',
        onClose: '&',
        onImagesUpdated: '&',
    },
    controller: class ImageViewerCtrl {

        static get $inject() {
            return ['$scope', '$window', '$element', '$timeout', '$document', 'imageInspector', 'images', 'usSpinnerService'];
        }

        constructor($scope, $window, $element, $timeout, $document, imageInspector, images, spinner) {
            this.$scope = $scope;
            this.$window = $window;
            this.$element = $element;
            this.$timeout = $timeout;
            this._imageInspector = imageInspector;
            this._spinner = spinner;
            this._images = images;
            this._canvas = $document[0].createElement('canvas');
            this._canvasContext = this._canvas.getContext("2d");
            this._imageDownload = $element.find(".image-viewer__download")[0];
        }

        $onChanges(changes) {
            this.selectedImage = angular.copy(changes.image.currentValue);
            if (this.selectedImage) {
                this._spinner.spin('spinner-1');
                angular.element('body').addClass('stop-scrolling');
            }
        }

        $postLink() {
            this.$window.addEventListener('keydown', (event) => {
                if (this.selectedImage && event.keyCode === 27) {
                    this.close(event);
                    this.$scope.$apply();
                }
            });
        }

        getScore() {
            if (this.selectedImage) {
                return parseFloat(this.selectedImage.score * 100).toFixed(2);
            }
            return null;
        }

        originalURL() {
            this.$window.open(this.selectedImage.originalURL);
        }

        loaded($event, img) {
            this._spinner.stop('spinner-1');
            const imageNode = $event.target;
            this._imageInspector.inspect(img, $event.target,
                this._images.checkForImageFailure(img, (failure) => {
                    if (failure) {
                        this._images.removeImage(img);
                        angular.element('body').removeClass('stop-scrolling');
                        this.selectedImage = null;
                        this.onClose();
                        this.onImagesUpdated();
                    }
            }));
        }

        loadingError(image) {
            this._spinner.stop('spinner-1');
            this._images.checkForImageFailure(image);
            this._images.removeImage(image);
            angular.element('body').removeClass('stop-scrolling');
            this.selectedImage = null;
            this.onClose();
            this.onImagesUpdated();
        }

        save() {
            this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this._imageDownload.href = "";
            this._imageDownload.download = "";
            if (this.selectedImage) {
                const image = new Image();
                image.crossOrigin = "anonymous";
                image.onload = () => {
                    this._canvas.width = image.naturalWidth;
                    this._canvas.height = image.naturalHeight;
                    let url = null;
                    try {
                        this._canvasContext.drawImage(image, 0, 0);
                        if (image.src.indexOf(".jpg") > -1) {
                            url = this._canvas.toDataURL("image/jpeg");
                        } else if (image.src.indexOf(".gif") > -1) {
                            url = this._canvas.toDataURL("image/gif");
                        } else {
                            url = this._canvas.toDataURL("image/png");
                        }
                    } catch (e) {
                        console.error(e);
                    }
                    if (url) {
                        this._imageDownload.href = url;
                        this._imageDownload.download = image.src.split(/(\\|\/)/g).pop();
                        this.$timeout(() => {
                            this._imageDownload.click();
                        }, 100, false);
                    }
                };
                image.onerror = (e) => {
                    console.log(e);
                    const win = this.$window.open(this.selectedImage.url, '_blank');
                    win ? win.focus() : null;
                };
                image.src = this.selectedImage.url;
            }
        }

        close($event) {
            const target = $event.target;
            if (target.hasAttribute("imageviewer-close") || $event.keyCode === 27) {
                $event.stopPropagation();
                this._spinner.stop('spinner-1');
                angular.element('body').removeClass('stop-scrolling');
                this.selectedImage = null;
                this._canvasContext.clearRect(0, 0, this._canvas.width, this._canvas.height);
                this._imageDownload.href = "";
                this._imageDownload.download = "";
                this.onClose();
            }
        }
    },
};
