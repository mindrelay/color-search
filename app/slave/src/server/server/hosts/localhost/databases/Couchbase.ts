// tslint:disable:align
 // tslint:disable:prefer-for-of
const couchbase = require("couchbase");
import Debug = require("debug");
const debug = Debug("CouchbaseDB");

export default class Couchbase {

    private cluster: any;
    private url: string;
    private user: string;
    private pass: string;
    private imagesBucket: any;
    private wordEmbeddingsBucket: any;

    constructor() {
        this.cluster = null;
        this.url = "couchbase://<couchbase-host>";
        this.user = "<set-couchbase-user>";
        this.pass = "<set-couchbase-password>";
    }

    public async connection(bucket: string) {
        try {
            if (this.cluster === null) {
                this.cluster = new couchbase.Cluster(this.url);
                this.cluster.authenticate(this.user, this.pass);
            }
            switch (bucket) {
                case "images" : {
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
        } catch (e) {
            console.error("Connection to Couchbase failed.");
            return Promise.reject(new Error("LocalHost Couchbase connection failed."));
        }
    }
}
