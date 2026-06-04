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
const Descriptors_1 = require("../../descriptors/Descriptors");
const Settings_1 = require("../../Settings");
const Debug = require("debug");
const debug = Debug("ImagesDAOMongo");
class ImagesDAOMongo {
    constructor() {
        this.db = Settings_1.default.db();
        this.nodeId = Settings_1.default.global().id;
        this.images = "imagesWang2";
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collection = yield this.db.connection(this.images);
                yield collection.deleteOne({ id });
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    saveMany(descriptors) {
        return __awaiter(this, void 0, void 0, function* () {
            let saved = new Array();
            if (descriptors && descriptors.length > 0) {
                debug("saving...");
                try {
                    const collection = yield this.db.connection(this.images);
                    yield collection.createIndex({ id: 1 }, { unique: true });
                    saved = yield this.save(collection, descriptors);
                    debug("saving successful");
                }
                catch (err) {
                    console.error(err);
                    saved = [];
                }
            }
            return descriptors.filter((desc) => saved.includes(desc.id));
        });
    }
    /** Amount of images in database on master
    * @return Number of images in master database
    */
    countForNode() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collection = yield this.db.connection(this.images);
                return yield collection.count();
            }
            catch (e) {
                console.error(e);
                return 0;
            }
        });
    }
    iterateNode(callback, max = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = yield this.db.connection(this.images);
            return new Promise((res, rej) => {
                let count = 0;
                const cursor = collection.find({ node: this.nodeId });
                cursor.batchSize(1000)
                    .forEach((doc) => {
                    if (max && count >= max) {
                        res();
                        cursor.close();
                    }
                    count++;
                    callback(new Descriptors_1.ImageDescriptor(doc));
                }, (end) => {
                    res();
                });
            });
        });
    }
    save(collection, descs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((res, rej) => collection.insertMany(descs.map((desc) => desc.toJSON()), { ordered: false }, (err, result) => {
                if (err && err.code === 11000) {
                    const ids = Array.from(result.getInsertedIds()).map((o) => o._id);
                    collection.find({ _id: { $in: ids } }).toArray()
                        .then((docs) => res(docs ? Array.from(docs).map((val) => val.id) : []))
                        .catch((e) => rej(e));
                }
                else if (err) {
                    rej(err);
                }
                else {
                    res(result.ops ? Array.from(result.ops).map((val) => val.id) : []);
                }
            }));
        });
    }
}
exports.default = ImagesDAOMongo;
