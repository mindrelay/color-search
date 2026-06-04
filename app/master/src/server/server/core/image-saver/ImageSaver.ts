import childProcess = require("child_process");
import Cluster from "../cluster/Cluster";
import {ImageDescriptor} from "../descriptors/Descriptors";
import {Index} from "../index/Index";
import Debug = require("debug");
const debug = Debug("ImageSaver");

/** Manages child process which is used for loading and saving new images from several sources */
export default class ImageSaver {

    private child: any;
    private enabled: boolean;
    private sleepTime: number;
    private index: Index;
    private saveLimit: number;
    private timeGap: number;

    constructor(index: Index, config: {enabled: boolean, sleepTime: number, timeGap: number}) {
        this.enabled = config.enabled === true;
        this.sleepTime = config.sleepTime || 5000;
        this.timeGap = config.timeGap || 5000;
        this.index = index;
        this.child = null;
    }

    /** Start child process for image loading */
    public start(): void {
        if (this.enabled) {
            debug("starting image loading process...");
            this.child = childProcess.fork("./server/core/image-saver/ImageLoading.js");
            this.child.on("message", (d) => {
                switch (d.message) {
                    case "sleep": this.restart(this.sleepTime); break;
                    case "save": this.save(d.images); break;
                    case "restart": this.restart(60000); break;
                    case "stop": this.stop(); break;
                }
            });
        }
    }

    public enable(): void {
        this.enabled = true;
    }

    public disable(): void {
        this.enabled = false;
        this.stop();
    }

    private async save(descJSONs: any[]) {
        debug("saving descriptors...");
        if (descJSONs.length > 0) {
            this.index.indexMany(descJSONs.map((desc) => new ImageDescriptor(desc)));
        }
        const ready = await Cluster.readyForSaving();
        if (ready && ready.some((elem) => elem.ready)) {
            setTimeout(() => this.child.send({message: "load-next", data: {}}), this.timeGap);
        } else {
            this.restart(this.sleepTime);
        }
    }

    private restart(time: number) {
        this.stop();
        setTimeout(() => this.start(), time);
    }

    private stop(): void {
        if (this.child) {
            debug("stop loading process...");
            this.child.kill();
        }
    }
}
