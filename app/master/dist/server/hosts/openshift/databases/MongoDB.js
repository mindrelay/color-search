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
const mongodb_1 = require("mongodb");
class MongoDB {
    constructor() {
        this.conn = null;
    }
    connection(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.conn == null) {
                let mongoURL = null;
                mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
                let mongoURLLabel = "";
                if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
                    const mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
                    const mongoHost = process.env[mongoServiceName + "_SERVICE_HOST"];
                    const mongoPort = process.env[mongoServiceName + "_SERVICE_PORT"];
                    const mongoDatabase = process.env[mongoServiceName + "_DATABASE"];
                    const mongoPassword = process.env[mongoServiceName + "_PASSWORD"];
                    const mongoUser = process.env[mongoServiceName + "_USER"];
                    if (mongoHost && mongoPort && mongoDatabase) {
                        mongoURLLabel = mongoURL = "mongodb://";
                        if (mongoUser && mongoPassword) {
                            mongoURL += mongoUser + ":" + mongoPassword + "@";
                        }
                        mongoURLLabel += mongoHost + ":" + mongoPort + "/" + mongoDatabase;
                        mongoURL += mongoHost + ":" + mongoPort + "/" + mongoDatabase;
                    }
                }
                try {
                    this.conn = yield mongodb_1.MongoClient.connect(mongoURL);
                }
                catch (e) {
                    console.error("Connection to MongoDB failed.");
                    return Promise.reject(new Error("OpenShift MongoDB connection failed."));
                }
            }
            return collection ? this.conn.collection(collection) : this.conn;
        });
    }
}
exports.default = MongoDB;
