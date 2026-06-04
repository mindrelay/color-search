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
const request = require("request");
const Debug = require("debug");
const debug = Debug("JsonRPC");
class JsonRPC {
    constructor() { }
    static request(url, method, data, secret) {
        return __awaiter(this, void 0, void 0, function* () {
            debug("request...");
            return yield new Promise((res, rej) => {
                request({
                    method: "POST",
                    headers: {
                        Authorization: secret
                    },
                    uri: url,
                    body: JsonRPC.requestMessage(method, data),
                    json: true,
                }, (error, response, body) => {
                    if (!error && body.result !== undefined) {
                        res(body.result);
                    }
                    else {
                        rej(error || body.error);
                    }
                });
            });
        });
    }
    static requestMessage(methodName, args) {
        return {
            jsonrpc: "2.0",
            id: null,
            method: methodName,
            params: args,
        };
    }
}
exports.default = JsonRPC;
