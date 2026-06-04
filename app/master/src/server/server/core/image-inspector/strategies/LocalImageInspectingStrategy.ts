// tslint:disable:no-bitwise
import fs = require("fs");
import request = require("request");
import Debug = require("debug");
import ResultDTO from "../../dto/ResultDTO";
import ImageInspectingStrategy from "../ImageInspectingStrategy";
const debug = Debug("DirectorySourceImageInspectingStrategy");

export default class LocalImageInspectingStrategy implements ImageInspectingStrategy {

    private name: string;

    constructor() {
        this.name = "directory";
    }

    public async imageIsOk(image: ResultDTO): Promise<boolean> {
        debug("inspect...");
        let imageIsOK: boolean = true;
        imageIsOK = await this.imageURLisOK(image.url);
        imageIsOK = imageIsOK && await this.imageURLisOK(image.previewURL);
        return imageIsOK;
    }

    public sourceName(): string {
        return this.name;
    }

    private async imageURLisOK(url: string): Promise<boolean> {
        return await new Promise<boolean>((res, rej) => {
            let imageIsOk = true;
            request({
                method: "GET",
                uri: url,
                }, (error, response, body) => {
                if (!error && response.statusCode) {
                    debug("status code: " + response.statusCode);
                }
                if (error || response.statusCode !== 200) {
                    imageIsOk = false;
                }
                res(imageIsOk);
            });
        });
    }
}
