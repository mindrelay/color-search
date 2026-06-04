import request = require("request");
import ResultDTO from "../../dto/ResultDTO";
import ImageInspectingStrategy from "../ImageInspectingStrategy";
import Debug = require("debug");
const debug = Debug("FlickrSourceImageInspectingStrategy");

/**
* Inspecting strategy for flickr images.
* Flickr performs http redirection for unavailable images.
* This class checks if URL of the image has
* a http redirection. The unavailable flickr images will be removed
* from db and index by image inspector class.
*/
export default class FlickrImageInspectingStrategy implements ImageInspectingStrategy {

    private name: string;

    constructor() {
        this.name = "flickr";
    }

    public async imageIsOk(image: ResultDTO): Promise<boolean> {
        return await new Promise<boolean>((res, rej) => {
            let imageIsOk = true;
            request({
                method: "GET",
                uri: image.url,
                followRedirect : false
                }, (error, response, body) => {
                const code = !error && response.statusCode ? Number(response.statusCode).toString() : "0";
                if (!error && response.statusCode) {
                    debug("status code: " + response.statusCode);
                }
                if (!error && [3, 4].includes(parseInt(code[0], 10))) {
                    debug("delete faulty image...");
                    imageIsOk = false;
                }
                res(imageIsOk);
            });
        });
    }

    public sourceName(): string {
        return this.name;
    }
}
