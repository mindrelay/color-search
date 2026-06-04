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
const DescriptorBuilder_1 = require("../descriptors/DescriptorBuilder");
const ImageDTO_js_1 = require("../dto/ImageDTO.js");
const EventHub_1 = require("../EventHub");
const flatten = require("arr-flatten");
const Debug = require("debug");
const debug = Debug("ImageLoader");
/** Collects image data from several image sources and creates image descriptors*/
class ImageLoader {
    constructor(...sources) {
        this.sources = Array.isArray(sources) ? sources : new Array();
        this.attempts = 0;
        this.ATTEMPTS_LIMIT = 10;
    }
    /** Collects data from image sources asynchronously.
    * Each image data source delivers a certain amount
    * of image data chunks (ImageDTOs) per call.
    * This asynchronous method can be invoked in a loop
    * to collect data from image sources permanently.
    */
    loadNext() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sources.length < 1) {
                return Promise.reject("No image sources found");
            }
            const sources = this.sources.map((source) => source.read());
            let data = new Array();
            try {
                data = yield Promise.all(sources);
                const dtos = flatten(data).filter((dto) => dto instanceof ImageDTO_js_1.default);
                debug(`DTOs from image sources: ${dtos.length}`);
                const descriptors = yield DescriptorBuilder_1.DescriptorBuilder.createMany(dtos);
                this.attempts = descriptors.length < 1 ? this.attempts + 1 : 0;
                if (this.attempts >= this.ATTEMPTS_LIMIT) {
                    debug("go to sleep...");
                    this.attempts = 0;
                    EventHub_1.default.emit("sleep");
                }
                else {
                    EventHub_1.default.emit("save", descriptors);
                }
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.default = ImageLoader;
