import {DescriptorBuilder} from "../descriptors/DescriptorBuilder";
import ImageDTO from "../dto/ImageDTO.js";
import EventHub from "../EventHub";
import ImageSource from "../image-sources/ImageSource";
import flatten = require("arr-flatten");
import Debug = require("debug");
const debug = Debug("ImageLoader");

/** Collects image data from several image sources and creates image descriptors*/
export default class ImageLoader {

    private sources: ImageSource[];
    private attempts: number;
    private ATTEMPTS_LIMIT: number;

    constructor(...sources: ImageSource[]) {
        this.sources = Array.isArray(sources) ? sources : new Array<ImageSource>();
        this.attempts = 0;
        this.ATTEMPTS_LIMIT = 10;
    }

    /** Collects data from image sources asynchronously.
    * Each image data source delivers a certain amount
    * of image data chunks (ImageDTOs) per call.
    * This asynchronous method can be invoked in a loop
    * to collect data from image sources permanently.
    */
    public async loadNext(): Promise<void> {
        if (this.sources.length < 1) {
            return Promise.reject("No image sources found");
        }
        const sources = this.sources.map((source) => source.read());
        let data = new Array<ImageDTO[]>();
        try {
            data = await Promise.all(sources);
            const dtos = flatten(data).filter((dto) => dto instanceof ImageDTO);
            debug(`DTOs from image sources: ${dtos.length}`);
            const descriptors = await DescriptorBuilder.createMany(dtos);
            this.attempts = descriptors.length < 1 ? this.attempts + 1 : 0;
            if (this.attempts >= this.ATTEMPTS_LIMIT) {
                debug("go to sleep...");
                this.attempts = 0;
                EventHub.emit("sleep");
            } else {
                EventHub.emit("save", descriptors);
            }
        } catch (e) {
            console.error(e);
        }
    }
}
