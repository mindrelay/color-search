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
// tslint:disable:align
// tslint:disable:prefer-for-of
const couchbase = require("couchbase");
const Debug = require("debug");
const debug = Debug("CouchbaseDB");
class Couchbase {
    constructor() {
        this.cluster = null;
        this.url = "couchbase://<couchbase-host>";
        this.user = "<set-couchbase-user>";
        this.pass = "<set-couchbase-password>";
    }
    connection(bucket) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.cluster === null) {
                    this.cluster = new couchbase.Cluster(this.url);
                    this.cluster.authenticate(this.user, this.pass);
                }
                switch (bucket) {
                    case "images": {
                        if (!this.imagesBucket) {
                            this.imagesBucket = this.cluster.openBucket("images");
                        }
                        return this.imagesBucket;
                    }
                    case "wordembeddings": {
                        if (!this.wordEmbeddingsBucket) {
                            this.wordEmbeddingsBucket = this.cluster.openBucket("wordembeddings");
                        }
                        return this.wordEmbeddingsBucket;
                    }
                }
            }
            catch (e) {
                console.error("Connection to Couchbase failed.");
                return Promise.reject(new Error("LocalHost Couchbase connection failed."));
            }
        });
    }
}
exports.default = Couchbase;
