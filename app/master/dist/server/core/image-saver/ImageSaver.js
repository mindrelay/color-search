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
const childProcess = require("child_process");
const Cluster_1 = require("../cluster/Cluster");
const Descriptors_1 = require("../descriptors/Descriptors");
const Debug = require("debug");
const debug = Debug("ImageSaver");
/** Manages child process which is used for loading and saving new images from several sources */
class ImageSaver {
    constructor(index, config) {
        this.enabled = config.enabled === true;
        this.sleepTime = config.sleepTime || 5000;
        this.timeGap = config.timeGap || 5000;
        this.index = index;
        this.child = null;
    }
    /** Start child process for image loading */
    start() {
        if (this.enabled) {
            debug("starting image loading process...");
            this.child = childProcess.fork("./server/core/image-saver/ImageLoading.js");
            this.child.on("message", (d) => {
                switch (d.message) {
                    case "sleep":
                        this.restart(this.sleepTime);
                        break;
                    case "save":
                        this.save(d.images);
                        break;
                    case "restart":
                        this.restart(60000);
                        break;
                    case "stop":
                        this.stop();
                        break;
                }
            });
        }
    }
    enable() {
        this.enabled = true;
    }
    disable() {
        this.enabled = false;
        this.stop();
    }
    save(descJSONs) {
        return __awaiter(this, void 0, void 0, function* () {
            debug("saving descriptors...");
            if (descJSONs.length > 0) {
                this.index.indexMany(descJSONs.map((desc) => new Descriptors_1.ImageDescriptor(desc)));
            }
            const ready = yield Cluster_1.default.readyForSaving();
            if (ready && ready.some((elem) => elem.ready)) {
                setTimeout(() => this.child.send({ message: "load-next", data: {} }), this.timeGap);
            }
            else {
                this.restart(this.sleepTime);
            }
        });
    }
    restart(time) {
        this.stop();
        setTimeout(() => this.start(), time);
    }
    stop() {
        if (this.child) {
            debug("stop loading process...");
            this.child.kill();
        }
    }
}
exports.default = ImageSaver;
