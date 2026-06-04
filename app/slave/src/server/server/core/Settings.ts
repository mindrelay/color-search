// tslint:disable: no-var-requires
// tslint:disable: no-string-literal
import Debug = require("debug");
import Host from "../hosts/Host";
import LocalHost from "../hosts/localhost/LocalHost";
const config = require("../app.config.json");
const debug = Debug("Settings");

class Settings {

    private config: any;
    private host: Host;

    constructor(conf) {
        debug("init settings...");
        this.config = conf;
        const host = typeof conf["host"] === "string" ? conf["host"].toLowerCase() : "" ;
        const database = typeof conf["database"] === "string" ? conf["database"].toLowerCase() : "mongodb" ;
        switch (host) {
            default: this.host = new LocalHost(database); break;
        }
    }

    public db() {
        return this.host.getDb();
    }

    public global(): any {
        const o: {[k: string]: any} = {};
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

    public searchRequest(): any {
        return this.config["searchRequest"] ? this.config["searchRequest"] : {};
    }

    public textSimilarity(): any {
        return this.config["textSimilarity"] ? this.config["textSimilarity"] : {};
    }

    public index(): any {
        return this.config["index"] ? this.config["index"] : {};
    }

}

export default new Settings(config);
