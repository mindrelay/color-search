import md5 = require ("md5");
import Cluster from "../core/cluster/Cluster";
import Debug = require("debug");
import ImageDTO from "../core/dto/ImageDTO";
import ResultDTO from "../core/dto/ResultDTO";
import ImageFinder from "../core/image-finder/ImageFinder";
import ImageInspector from "../core/image-inspector/ImageInspector";
import {Index} from "../core/index/Index";
import SearchRequest from "../core/SearchRequest";
import Settings from "../core/Settings";
const debug = Debug("Controller");
const config = Settings.global();
const searchConfig = Settings.searchRequest();

/**
* App controller handles incoming requests.
*/
export default class Controller {

    private finder: ImageFinder;
    private loginRequired: boolean;
    private imageInspector: ImageInspector;
    private auth: string;

    constructor(index: Index) {
        this.finder = new ImageFinder(index);
        this.imageInspector = new ImageInspector(index);
        this.auth = md5(`${config.password}`);
        this.loginRequired = config.loginRequired;
    }

    /** Find images */
    public find(req, res): void {
        const colors = req.body.params.colors;
        const words = req.body.params.words;
        const settings = req.body.params.settings;
        const userAuth = req.body.params.auth;
        const authOk = this.loginRequired ? userAuth === this.auth : true;
        if (colors && words && settings && authOk) {
            let timeStart = 0;
            SearchRequest.create(colors, words, settings, searchConfig)
            .then((searchRequest: SearchRequest) => {
                timeStart = Date.now();
                return this.finder.findSimilarImages(searchRequest);
            })
            .then((result: ResultDTO[]) => {
                debug(`total images found: ${result.length}`);
                const timeEnd = Date.now();
                debug(`elapsed: ${timeEnd - timeStart} ms`);
                this.succ(req, res, {imgs: result});
            })
            .catch((e) => {
                console.error(e);
                this.error(req, res);
            });
        } else {
            this.error(req, res);
        }
    }

    public login(req, res): void {
        const login = req.body.params.login;
        this.succ(req, res, {success: login === this.auth});
    }

    public inspectImageForFailure(req, res): void {
        const image = req.body.params.image;
        if (image) {
            debug("inspect image for failure...");
            this.imageInspector.imageIsOk(image as ResultDTO)
            .then((imageIsOk: boolean) => {
                debug(`image is faulty: ${!imageIsOk}`);
                this.succ(req, res, !imageIsOk);
            })
            .catch((e) => {
                console.error(e);
                this.error(req, res);
            });
        } else {
            this.error(req, res);
        }
    }

    public isLoginRequired(req, res): void {
        this.succ(req, res, {required: this.loginRequired});
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
