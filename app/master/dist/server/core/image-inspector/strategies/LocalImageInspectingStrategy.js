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
const debug = Debug("DirectorySourceImageInspectingStrategy");
class LocalImageInspectingStrategy {
    constructor() {
        this.name = "directory";
    }
    imageIsOk(image) {
        return __awaiter(this, void 0, void 0, function* () {
            debug("inspect...");
            let imageIsOK = true;
            imageIsOK = yield this.imageURLisOK(image.url);
            imageIsOK = imageIsOK && (yield this.imageURLisOK(image.previewURL));
            return imageIsOK;
        });
    }
    sourceName() {
        return this.name;
    }
    imageURLisOK(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((res, rej) => {
                let imageIsOk = true;
                request({
                    method: "GET",
                    uri: url,
                }, (error, response, body) => {
                    if (!error && response.statusCode) {
                        debug("status code: " + response.statusCode);
                    }
                    if (error || response.statusCode !== 200) {
                        imageIsOk = false;
                    }
                    res(imageIsOk);
                });
            });
        });
    }
}
exports.default = LocalImageInspectingStrategy;
