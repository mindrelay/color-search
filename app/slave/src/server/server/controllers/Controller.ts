import Debug = require("debug");
import {ImageDescriptor} from "../core/descriptors/Descriptors";
import ImageDescriptors from "../core/descriptors/ImageDescriptors";
import ResultDTO from "../core/dto/ResultDTO";
import ImageFinder from "../core/image-finder/ImageFinder";
import {Index} from "../core/index/Index";
import SearchRequest from "../core/SearchRequest";
import Settings from "../core/Settings";
const config = Settings.global();
const debug = Debug("Controller");

/**
* App main controller handles incoming requests.
* App router calls methods of this controller.
*/
export default class Controller {

    private finder: ImageFinder;
    private descriptors: ImageDescriptors;

    constructor(index: Index) {
        this.finder = new ImageFinder(index);
        this.descriptors = new ImageDescriptors(index, config.saveLimit);
    }

    public saveDescriptors(req, res): void {
        const params = req.body.params;
        const descs = params && params.descriptors ? params.descriptors : [];
        const descriptors = new Array<ImageDescriptor>();
        for (let i = 0, j = descs.length; i < j; i++) {
            descriptors.push(new ImageDescriptor(descs[i]));
        }
        this.descriptors.saveMany(descriptors)
        .then(() => {
            this.succ(req, res, {});
        })
        .catch((e) => {
            console.error(e);
            this.error(req, res);
        });
    }

    public spaceAvailable(req, res): void {
        debug("check if space is available...");
        this.descriptors.maxReached()
        .then((maxReached: boolean) => {
            debug(`space available: ${!maxReached}`);
            this.succ(req, res, !maxReached);
        })
        .catch((e) => {
            console.error(e);
            this.error(req, res);
        });
    }

    /** Find images */
    public findImages(req, res): void {
        debug("find images...");
        let searchRequest = null;
        try {
            searchRequest = req.body.params.request;
        } catch (e) {
            console.error(e);
        }
        if (searchRequest) {
            const request = SearchRequest.set(searchRequest);
            this.finder.findSimilarImages(request)
            .then((result: ResultDTO[]) => {
                debug(`images found: ${result.length}`);
                this.succ(req, res, result);
            })
            .catch((error) => {
                console.error(error);
                this.succ(req, res, []);
            });
        } else {
            console.error("no search request found");
            this.succ(req, res, []);
        }
    }

    public deleteDescriptor(req, res): void {
        const params = req.body.params;
        const id = params && typeof params.id === "number" ? params.id : null;
        if (id) {
            debug("delete descriptor...");
            this.descriptors.delete(id);
        }
        this.succ(req, res, {});
    }

    public error(req, res, code: number = -3200, message: string = "Server error...", data: any  = {}): void {
        const id = req.body && req.body.id !== undefined ? req.body.id : null;
        const o = {jsonrpc: "2.0", error: {code, message, data}, id};
        res.writeHead(200, {"content-type": "application/json"});
        res.end(JSON.stringify(o));
    }

    public succ(req, res, result): void {
        const id = req.body.id !== undefined ? req.body.id : null;
        const o = {jsonrpc: "2.0", result, id};
        res.writeHead(200, {"content-type": "application/json"});
        res.end(JSON.stringify(o));
    }
}
