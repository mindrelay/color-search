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
const JsonRPC_1 = require("./JsonRPC");
const md5 = require("md5");
const Debug = require("debug");
const debug = Debug("SlaveNode");
class SlaveNode {
    constructor(url, secret, id, timeout) {
        this.url = url;
        this.secret = md5(`${secret}`);
        this.id = id;
        this.timmeout = timeout;
    }
    getId() {
        return this.id;
    }
    saveDescriptors(descriptors) {
        return __awaiter(this, void 0, void 0, function* () {
            debug("saving...");
            return yield new Promise((res, rej) => {
                setTimeout(() => res([]), this.timmeout);
                JsonRPC_1.default.request(this.url, "saveDescriptors", { descriptors }, this.secret)
                    .then((result) => res(result))
                    .catch((e) => {
                    console.error(e);
                    res([]);
                });
            });
        });
    }
    deleteDescriptor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((res, rej) => {
                setTimeout(() => res(false), this.timmeout);
                JsonRPC_1.default.request(this.url, "deleteDescriptor", { id }, this.secret)
                    .then(() => res())
                    .catch((e) => {
                    console.error(e);
                    res(false);
                });
            });
        });
    }
    findImages(request) {
        return __awaiter(this, void 0, void 0, function* () {
            debug("find...");
            return yield new Promise((res, rej) => {
                setTimeout(() => res(new Array()), this.timmeout);
                JsonRPC_1.default.request(this.url, "findImages", { request: request.toJSON() }, this.secret)
                    .then((result) => {
                    res(result && result.length > 0 ? Array.from(result) : []);
                })
                    .catch((e) => {
                    console.error(e);
                    res(new Array());
                });
            });
        });
    }
    spaceAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((res, rej) => {
                setTimeout(() => res(false), this.timmeout);
                JsonRPC_1.default.request(this.url, "spaceAvailable", "", this.secret)
                    .then((result) => res(result))
                    .catch((e) => {
                    console.error(e);
                    res(false);
                });
            });
        });
    }
}
exports.default = SlaveNode;
