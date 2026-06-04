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
const EventHub_1 = require("../EventHub");
const FlickrSource_1 = require("../image-sources/flickr/FlickrSource");
const LocalSource_1 = require("../image-sources/LocalSource");
const Settings_1 = require("../Settings");
const ImageLoader_1 = require("./ImageLoader");
const Debug = require("debug");
const debug = Debug("ImageLoading");
const EventEmitter = require("events").EventEmitter;
const config = Settings_1.default.imageSaver();
/** Process for loading images from several sources.
* The module configuration allows to "sleep" and "restart" this process after
* emmiting predefined events like "tagging-failed". For example, the "auto-tagging"
* of images can fail because of external service usage limitations or fatal errors.
*/
const sources = new Array();
for (const conf of config.sources) {
    if (conf.enabled) {
        switch (conf.name) {
            case "local":
                sources.push(new LocalSource_1.default(conf));
                break;
            case "flickr":
                sources.push(new FlickrSource_1.default(conf));
                break;
            default: break;
        }
    }
}
const save = (data) => __awaiter(this, void 0, void 0, function* () {
    let saved = new Array();
    try {
        saved = yield Cluster_1.default.saveDescriptors(data);
    }
    catch (e) {
        console.log(e);
    }
    process.send({ message: "save", images: saved });
});
debug("sources: " + sources.length);
const imageLoader = new ImageLoader_1.default(...sources);
imageLoader.loadNext();
EventHub_1.default.on("tagging-failed", () => {
    if (config.sleepIfTaggingFailed) {
        process.send({ message: "sleep" });
    }
});
EventHub_1.default.on("translation-failed", () => {
    if (config.sleepIfTranslationFailed) {
        process.send({ message: "sleep" });
    }
});
EventHub_1.default.on("sleep", () => {
    process.send({ message: "sleep" });
});
EventHub_1.default.on("save", (data) => {
    save(data);
});
EventHub_1.default.on("stop", (data) => {
    process.send({ message: "stop" });
});
const inputEvents = new EventEmitter();
inputEvents.on("load-next", () => {
    imageLoader.loadNext();
});
process.on("message", (d) => {
    inputEvents.emit(d.message, d.data);
});
