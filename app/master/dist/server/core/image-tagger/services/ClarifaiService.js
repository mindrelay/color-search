"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:prefer-for-of
const Clarifai = require("clarifai");
class ClarifaiService {
    constructor() {
        this.clarifaiAPI = new Clarifai.App("***", "***");
    }
    tagByPublicURL(url, sim) {
        const tags = new Array();
        return this.clarifaiAPI.models.predict(Clarifai.GENERAL_MODEL, url)
            .then((response) => {
            if (response.status.code === 10000) {
                const predicts = response.outputs[0].data.concepts;
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < predicts.length; i++) {
                    const value = parseFloat(predicts[i].value) * 100;
                    if (value > sim) {
                        tags.push(predicts[i].name);
                    }
                }
                return tags;
            }
            else {
                console.error("ClarifaiService: Error " + response.status.code);
                return Promise.reject(new Error(response.status.code));
            }
        });
    }
    tagByBase64(base64, sim) {
        const tags = new Array();
        return this.clarifaiAPI.models.predict(Clarifai.GENERAL_MODEL, { base64 })
            .then((response) => {
            if (response.status.code === 10000) {
                const predicts = response.outputs[0].data.concepts;
                for (let i = 0; i < predicts.length; i++) {
                    const value = parseFloat(predicts[i].value) * 100;
                    if (value > sim) {
                        tags.push(predicts[i].name);
                    }
                }
                return tags;
            }
            else {
                console.error("ClarifaiService: Error " + response.status.code);
                return Promise.reject(new Error(response.status.code));
            }
        });
    }
}
exports.default = ClarifaiService;
