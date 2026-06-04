"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cluster_1 = require("../cluster/Cluster");
const FlickrImageInspectingStrategy_1 = require("./strategies/FlickrImageInspectingStrategy");
const LocalImageInspectingStrategy_1 = require("./strategies/LocalImageInspectingStrategy");
/**
* Inspects image URLs. If URL is corrupt, the image descriptor will be removed from
* database and index. Image inspector uses appropriate inspectiong startegies for different image sources.
*/
class ImageInspector {
    constructor(index) {
        this.index = index;
        this.strategies = new Map();
        const flickrStrategy = new FlickrImageInspectingStrategy_1.default();
        const directoryStrategy = new LocalImageInspectingStrategy_1.default();
        this.strategies.set(flickrStrategy.sourceName(), flickrStrategy);
        this.strategies.set(directoryStrategy.sourceName(), directoryStrategy);
    }
    /** Check if image url is ok
    * @param image Image data received from user
    * @return true/false if image url is ok
    */
    imageIsOk(image) {
        return __awaiter(this, void 0, void 0, function* () {
            let imageIsOk = true;
            if (this.strategies.has(image.source)) {
                const strategy = this.strategies.get(image.source);
                imageIsOk = yield strategy.imageIsOk(image);
                if (imageIsOk === false) {
                    Cluster_1.default.deleteDescriptor(image.id);
                    this.index.remove(image.id);
                }
            }
            return imageIsOk;
        });
    }
}
exports.default = ImageInspector;
