"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:prefer-for-of
const request = require("request");
class ImaggaService {
    constructor() {
        this.apiKey = "***";
        this.apiSecret = "***";
    }
    tagByPublicURL(url, sim) {
        const tags = new Array();
        return new Promise((resolve, reject) => {
            request.get("https://api.imagga.com/v1/tagging?url=" +
                encodeURIComponent(url), (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    const resultTags = JSON.parse(body).results[0].tags;
                    for (let i = 0; i < resultTags.length; i++) {
                        const value = parseFloat(resultTags[i].confidence);
                        if (value > sim) {
                            tags.push(resultTags[i].tag);
                        }
                    }
                    resolve(tags);
                }
                else {
                    console.error("ImaggaService: Error " + error || response.statusCode);
                    reject(new Error(error || response.statusCode));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        });
    }
    tagByBase64(base64, sim) {
        return Promise.reject(new Error("Tagging by Base64 not supported yet"));
    }
}
exports.default = ImaggaService;
