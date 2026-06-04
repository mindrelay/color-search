"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MongoDB_1 = require("./databases/MongoDB");
class OpenShift {
    constructor(database) {
        this.serverUrl = "http://<deployment-host>";
        this.port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
        this.ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
        switch (database.toLowerCase()) {
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
exports.default = OpenShift;
