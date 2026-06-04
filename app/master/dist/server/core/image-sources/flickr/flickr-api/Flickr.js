"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
class Flickr {
    constructor(key) {
        this.key = key;
        this.url = "https://api.flickr.com/services/rest/?";
    }
    get(method, opts) {
        let url = this.url
            + "&method=flickr." + method
            + "&api_key=" + this.key
            + "&format=json"
            + "&nojsoncallback=1";
        // tslint:disable-next-line:forin
        for (const item in opts) {
            url += "&" + item + "=" + opts[item];
        }
        return new Promise((res, rej) => {
            request(url, (error, response, body) => {
                if (!error) {
                    let jsonObj;
                    try {
                        jsonObj = JSON.parse(body);
                    }
                    catch (e) {
                        return rej(new Error("Error parsing JSON"));
                    }
                    res(jsonObj);
                }
                else {
                    rej(error);
                }
            });
        });
    }
}
exports.default = Flickr;
