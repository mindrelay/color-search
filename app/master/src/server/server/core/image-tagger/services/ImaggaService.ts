// tslint:disable:prefer-for-of
import request = require("request");
import ImageTaggingService from "../ImageTaggingService";

export default class ImaggaService implements ImageTaggingService {

    private apiKey: string;
    private apiSecret: string;

    constructor() {
        this.apiKey = "***";
        this.apiSecret = "***";
    }

    public tagByPublicURL(url: string, sim: number): Promise<string[]> {
        const tags: string[] = new Array<string>();
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
                }else {
                    console.error("ImaggaService: Error " + error || response.statusCode);
                    reject(new Error(error || response.statusCode));
                }
            }).auth(this.apiKey, this.apiSecret, true);
        });
    }

    public tagByBase64(base64: string, sim: number): Promise<string[]> {
        return Promise.reject(new Error("Tagging by Base64 not supported yet"));
    }
}
