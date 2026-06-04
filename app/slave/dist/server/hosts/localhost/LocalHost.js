"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Couchbase_1 = require("./databases/Couchbase");
const MongoDB_1 = require("./databases/MongoDB");
class LocalHost {
    constructor(database) {
        this.serverUrl = "http://<slave-host>:3000";
        this.port = 3000;
        this.ip = "<slave-host>";
        switch (database.toLowerCase()) {
            case "couchbase":
                this.dataBase = new Couchbase_1.default();
                break;
            default:
                this.dataBase = new MongoDB_1.default();
                break;
        }
    }
    getServerUrl() {
        return this.serverUrl;
    }
    getIp() {
        return this.ip;
    }
    getPort() {
        return this.port;
    }
    getDb() {
        return this.dataBase;
    }
}
exports.default = LocalHost;
