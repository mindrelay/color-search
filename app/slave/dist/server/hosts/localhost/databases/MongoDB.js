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
                const mongoURL = "mongodb://<mongodb-host>:27017/<database-name>";
                try {
                    this.conn = yield mongodb_1.MongoClient.connect(mongoURL);
                }
                catch (e) {
                    console.error("Connection to MongoDB failed.");
                    return Promise.reject(new Error("LocalHost MongoDB connection failed."));
                }
            }
            return collection ? this.conn.collection(collection) : this.conn;
        });
    }
}
exports.default = MongoDB;
