import Cluster from "../cluster/Cluster";
import EventHub from "../EventHub";
import FlickrSource from "../image-sources/flickr/FlickrSource";
import ImageSource from "../image-sources/ImageSource";
import LocalSource from "../image-sources/LocalSource";
import Settings from "../Settings";
import ImageLoader from "./ImageLoader";
import Debug = require("debug");
import {ImageDescriptor} from "../descriptors/Descriptors";
const debug = Debug("ImageLoading");
const EventEmitter = require("events").EventEmitter;
const config = Settings.imageSaver();

/** Process for loading images from several sources.
* The module configuration allows to "sleep" and "restart" this process after
* emmiting predefined events like "tagging-failed". For example, the "auto-tagging"
* of images can fail because of external service usage limitations or fatal errors.
*/
const sources = new Array<ImageSource>();
for (const conf of config.sources) {
    if (conf.enabled) {
        switch (conf.name) {
            case "local" : sources.push(new LocalSource(conf)); break;
            case "flickr" : sources.push(new FlickrSource(conf)); break;
            default: break;
        }
    }
}

const save = async (data: ImageDescriptor[]) => {
    let saved = new Array<ImageDescriptor>();
    try {
        saved = await Cluster.saveDescriptors(data);
    } catch (e) {
        console.log(e);
    }
    process.send({message: "save", images: saved});
};

debug("sources: " + sources.length);
const imageLoader = new ImageLoader(...sources);
imageLoader.loadNext();
EventHub.on("tagging-failed", () => {
    if (config.sleepIfTaggingFailed) {
        process.send({message: "sleep"});
    }
});
EventHub.on("translation-failed", () => {
    if (config.sleepIfTranslationFailed) {
        process.send({message: "sleep"});
    }
});
EventHub.on("sleep", () => {
    process.send({message: "sleep"});
});
EventHub.on("save", (data) => {
    save(data);
});
EventHub.on("stop", (data) => {
    process.send({message: "stop"});
});
const inputEvents = new EventEmitter();
inputEvents.on("load-next", () => {
    imageLoader.loadNext();
});
process.on("message", (d) => {
    inputEvents.emit(d.message, d.data);
});
