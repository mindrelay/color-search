// tslint:disable:prefer-for-of
import Clarifai = require("clarifai");
import ImageTaggingService from "../ImageTaggingService";

export default class ClarifaiService implements ImageTaggingService {

    private clarifaiAPI: any;

    constructor() {
        this.clarifaiAPI = new Clarifai.App(
            "***",
            "***",
        );
    }

    public tagByPublicURL(url: string, sim: number): Promise<string[]> {
        const tags: string[] = new Array<string>();
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
            }else {
                console.error("ClarifaiService: Error " + response.status.code);
                return Promise.reject(new Error(response.status.code));
            }
        });
    }

    public tagByBase64(base64: string, sim: number): Promise<string[]> {
        const tags: string[] = new Array<string>();
        return this.clarifaiAPI.models.predict(Clarifai.GENERAL_MODEL, {base64})
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
            }else {
                console.error("ClarifaiService: Error " + response.status.code);
                return Promise.reject(new Error(response.status.code));
            }
        });
    }
}
