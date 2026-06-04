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
const request = require("request");
const Debug = require("debug");
const debug = Debug("FlickrSourceImageInspectingStrategy");
/**
* Inspecting strategy for flickr images.
* Flickr performs http redirection for unavailable images.
* This class checks if URL of the image has
* a http redirection. The unavailable flickr images will be removed
* from db and index by image inspector class.
*/
class FlickrImageInspectingStrategy {
    constructor() {
        this.name = "flickr";
    }
    imageIsOk(image) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((res, rej) => {
                let imageIsOk = true;
                request({
                    method: "GET",
                    uri: image.url,
                    followRedirect: false
                }, (error, response, body) => {
                    const code = !error && response.statusCode ? Number(response.statusCode).toString() : "0";
                    if (!error && response.statusCode) {
                        debug("status code: " + response.statusCode);
                    }
                    if (!error && [3, 4].includes(parseInt(code[0], 10))) {
                        debug("delete faulty image...");
                        imageIsOk = false;
                    }
                    res(imageIsOk);
                });
            });
        });
    }
    sourceName() {
        return this.name;
    }
}
exports.default = FlickrImageInspectingStrategy;
