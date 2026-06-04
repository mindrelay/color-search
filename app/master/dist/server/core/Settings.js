"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable: no-var-requires
// tslint:disable: no-string-literal
const Debug = require("debug");
const LocalHost_1 = require("../hosts/localhost/LocalHost");
const OpenShift_1 = require("../hosts/openshift/OpenShift");
const config = require("../app.config.json");
const debug = Debug("Settings");
class Settings {
    constructor(conf) {
        debug("init settings...");
        this.config = conf;
        const host = typeof conf["host"] === "string" ? conf["host"].toLowerCase() : "";
        const database = typeof conf["database"] === "string" ? conf["database"].toLowerCase() : "mongodb";
        switch (host) {
            case "openshift":
                this.host = new OpenShift_1.default(database);
                break;
            default:
                this.host = new LocalHost_1.default(database);
                break;
        }
    }
    db() {
        return this.host.getDb();
    }
    global() {
        const o = {};
        o.serverUrl = this.host.getServerUrl();
        o.loginRequired = this.config["loginRequired"] === true;
        o.password = this.config["password"] || "secret";
        o.imgsPath = this.config["imgsPath"] || "imgs/public";
        o.database = typeof this.config["database"] === "string" ?
            this.config["database"].toLowerCase() : "mongodb";
        o.saveLimit = typeof this.config["saveLimit"] === "number" ?
            this.config["saveLimit"] : 100000;
        o.id = typeof this.config["id"] === "number" ? this.config["id"] : 1;
        o.ip = this.host.getIp();
        o.port = this.host.getPort();
        o.nodes = this.config["nodes"] || [];
        o.rpcPassword = this.config["rpcPassword"] || "";
        return o;
    }
    imageSaver() {
        return this.config["imageSaver"] || {};
    }
    textTranslator() {
        return this.config["textTranslator"] || {};
    }
    imageTagger() {
        return this.config["imageTagger"] || {};
    }
    searchRequest() {
        return this.config["searchRequest"] || {};
    }
    textSimilarity() {
        return this.config["textSimilarity"] || {};
    }
    index() {
        return this.config["index"] || {};
    }
}
exports.default = new Settings(config);
