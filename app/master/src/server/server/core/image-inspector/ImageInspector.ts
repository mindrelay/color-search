import Cluster from "../cluster/Cluster";
import ResultDTO from "../dto/ResultDTO";
import {Index} from "../index/Index";
import ImageInspectingStrategy from "./ImageInspectingStrategy";
import FlickrImageInspectingStrategy from "./strategies/FlickrImageInspectingStrategy";
import LocalImageInspectingStrategy from "./strategies/LocalImageInspectingStrategy";

/**
* Inspects image URLs. If URL is corrupt, the image descriptor will be removed from
* database and index. Image inspector uses appropriate inspectiong startegies for different image sources.
*/
export default class ImageInspector {

    private strategies: Map<string, ImageInspectingStrategy>;
    private index: Index;

    constructor(index: Index) {
        this.index = index;
        this.strategies = new Map();
        const flickrStrategy = new FlickrImageInspectingStrategy();
        const directoryStrategy = new LocalImageInspectingStrategy();
        this.strategies.set(flickrStrategy.sourceName(), flickrStrategy);
        this.strategies.set(directoryStrategy.sourceName(), directoryStrategy);
    }

    /** Check if image url is ok
    * @param image Image data received from user
    * @return true/false if image url is ok
    */
    public async imageIsOk(image: ResultDTO): Promise<boolean> {
        let imageIsOk = true;
        if (this.strategies.has(image.source)) {
            const strategy: ImageInspectingStrategy = this.strategies.get(image.source);
            imageIsOk = await strategy.imageIsOk(image);
            if (imageIsOk === false) {
                Cluster.deleteDescriptor(image.id);
                this.index.remove(image.id);
            }
        }
        return imageIsOk;
    }
}
