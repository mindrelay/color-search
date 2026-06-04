"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const md5 = require("md5");
const Debug = require("debug");
const ImageFinder_1 = require("../core/image-finder/ImageFinder");
const ImageInspector_1 = require("../core/image-inspector/ImageInspector");
const SearchRequest_1 = require("../core/SearchRequest");
const Settings_1 = require("../core/Settings");
const debug = Debug("Controller");
const config = Settings_1.default.global();
const searchConfig = Settings_1.default.searchRequest();
/**
* App controller handles incoming requests.
*/
class Controller {
    constructor(index) {
        this.finder = new ImageFinder_1.default(index);
        this.imageInspector = new ImageInspector_1.default(index);
        this.auth = md5(`${config.password}`);
        this.loginRequired = config.loginRequired;
    }
    /** Find images */
    find(req, res) {
        const colors = req.body.params.colors;
        const words = req.body.params.words;
        const settings = req.body.params.settings;
        const userAuth = req.body.params.auth;
        const authOk = this.loginRequired ? userAuth === this.auth : true;
        if (colors && words && settings && authOk) {
            let timeStart = 0;
            SearchRequest_1.default.create(colors, words, settings, searchConfig)
                .then((searchRequest) => {
                timeStart = Date.now();
                return this.finder.findSimilarImages(searchRequest);
            })
                .then((result) => {
                debug(`total images found: ${result.length}`);
                const timeEnd = Date.now();
                debug(`elapsed: ${timeEnd - timeStart} ms`);
                this.succ(req, res, { imgs: result });
            })
                .catch((e) => {
                console.error(e);
                this.error(req, res);
            });
        }
        else {
            this.error(req, res);
        }
    }
    login(req, res) {
        const login = req.body.params.login;
        this.succ(req, res, { success: login === this.auth });
    }
    inspectImageForFailure(req, res) {
        const image = req.body.params.image;
        if (image) {
            debug("inspect image for failure...");
            this.imageInspector.imageIsOk(image)
                .then((imageIsOk) => {
                debug(`image is faulty: ${!imageIsOk}`);
                this.succ(req, res, !imageIsOk);
            })
                .catch((e) => {
                console.error(e);
                this.error(req, res);
            });
        }
        else {
            this.error(req, res);
        }
    }
    isLoginRequired(req, res) {
        this.succ(req, res, { required: this.loginRequired });
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
