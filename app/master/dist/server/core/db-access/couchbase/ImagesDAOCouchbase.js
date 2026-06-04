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
// tslint:disable:prefer-for-of
// tslint:disable:max-line-length
// tslint:disable:prefer-const
// tslint:disable:one-variable-per-declaration
const Descriptors_1 = require("../../descriptors/Descriptors");
const Settings_1 = require("../../Settings");
const Debug = require("debug");
const couchbase = require("couchbase");
const debug = Debug("ImagesDAOCouchbase");
class ImagesDAOCouchbase {
    constructor() {
        this.db = Settings_1.default.db();
        this.nodeId = Settings_1.default.global().id;
        this.amountQuery = couchbase.N1qlQuery
            .fromString(`SELECT COUNT(*) as count from images WHERE node = ${this.nodeId}`);
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const bucket = yield this.db.connection("images");
            const query = couchbase.N1qlQuery.fromString(`DELETE FROM images USE KEYS '${id}'`);
            return yield new Promise((res, rej) => {
                bucket.query(query, {}, (err, rows) => {
                    if (err) {
                        console.log(err);
                    }
                    res();
                });
            });
        });
    }
    saveMany(descriptors) {
        return __awaiter(this, void 0, void 0, function* () {
            const saved = new Array();
            const bucket = yield this.db.connection("images");
            yield new Promise((res, rej) => {
                const loop = () => {
                    if (descriptors && descriptors.length > 0) {
                        const descriptor = descriptors.pop();
                        bucket.insert(`${descriptor.id}`, descriptor, (error, result) => {
                            error ? debug(error) : saved.push(descriptor);
                            loop();
                        });
                    }
                    else {
                        res();
                    }
                };
                loop();
            });
            return saved;
        });
    }
    /** Amount of images in database for this node
    * @return Number of images
    */
    countForNode() {
        return __awaiter(this, void 0, void 0, function* () {
            const bucket = yield this.db.connection("images");
            return yield new Promise((res, rej) => {
                bucket.query(this.amountQuery, {}, (err, rows) => {
                    if (err) {
                        console.log(err);
                        res(0);
                    }
                    else {
                        res(rows && isNaN(rows[0].count) ? 0 : Number.parseInt(rows[0].count));
                    }
                });
            });
        });
    }
    iterateNode(callback, max = Infinity) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = 0, step = 1000, offset = 0;
            const bucket = yield this.db.connection("images");
            yield new Promise((res, rej) => {
                const loop = () => {
                    if (count < max) {
                        const queryAll = couchbase.N1qlQuery
                            .fromString(`SELECT images.* FROM images WHERE node = ${this.nodeId} LIMIT ${step} OFFSET ${offset}`);
                        bucket.query(queryAll, {}, (err, rows) => {
                            offset += step;
                            if (err) {
                                console.log(err);
                                res();
                            }
                            else if (rows && rows.length > 0) {
                                let i = rows.length;
                                while (i--) {
                                    if (count < max) {
                                        callback(new Descriptors_1.ImageDescriptor(rows[i]));
                                    }
                                    else {
                                        break;
                                    }
                                    count++;
                                }
                                loop();
                            }
                            else {
                                res();
                            }
                        });
                    }
                    else {
                        res();
                    }
                };
                loop();
            });
        });
    }
}
exports.default = ImagesDAOCouchbase;
