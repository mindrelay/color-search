"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const Descriptors_1 = require("../core/descriptors/Descriptors");
const ImageDescriptors_1 = require("../core/descriptors/ImageDescriptors");
const ImageFinder_1 = require("../core/image-finder/ImageFinder");
const SearchRequest_1 = require("../core/SearchRequest");
const Settings_1 = require("../core/Settings");
const config = Settings_1.default.global();
const debug = Debug("Controller");
/**
* App main controller handles incoming requests.
* App router calls methods of this controller.
*/
class Controller {
    constructor(index) {
        this.finder = new ImageFinder_1.default(index);
        this.descriptors = new ImageDescriptors_1.default(index, config.saveLimit);
    }
    saveDescriptors(req, res) {
        const params = req.body.params;
        const descs = params && params.descriptors ? params.descriptors : [];
        const descriptors = new Array();
        for (let i = 0, j = descs.length; i < j; i++) {
            descriptors.push(new Descriptors_1.ImageDescriptor(descs[i]));
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
    spaceAvailable(req, res) {
        debug("check if space is available...");
        this.descriptors.maxReached()
            .then((maxReached) => {
            debug(`space available: ${!maxReached}`);
            this.succ(req, res, !maxReached);
        })
            .catch((e) => {
            console.error(e);
            this.error(req, res);
        });
    }
    /** Find images */
    findImages(req, res) {
        debug("find images...");
        let searchRequest = null;
        try {
            searchRequest = req.body.params.request;
        }
        catch (e) {
            console.error(e);
        }
        if (searchRequest) {
            const request = SearchRequest_1.default.set(searchRequest);
            this.finder.findSimilarImages(request)
                .then((result) => {
                debug(`images found: ${result.length}`);
                this.succ(req, res, result);
            })
                .catch((error) => {
                console.error(error);
                this.succ(req, res, []);
            });
        }
        else {
            console.error("no search request found");
            this.succ(req, res, []);
        }
    }
    deleteDescriptor(req, res) {
        const params = req.body.params;
        const id = params && typeof params.id === "number" ? params.id : null;
        if (id) {
            debug("delete descriptor...");
            this.descriptors.delete(id);
        }
        this.succ(req, res, {});
    }
    error(req, res, code = -3200, message = "Server error...", data = {}) {
        const id = req.body && req.body.id !== undefined ? req.body.id : null;
        const o = { jsonrpc: "2.0", error: { code, message, data }, id };
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(o));
    }
    succ(req, res, result) {
        const id = req.body.id !== undefined ? req.body.id : null;
        const o = { jsonrpc: "2.0", result, id };
        res.writeHead(200, { "content-type": "application/json" });
        res.end(JSON.stringify(o));
    }
}
exports.default = Controller;
