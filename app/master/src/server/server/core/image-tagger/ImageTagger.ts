import ServiceExecutor from "../common/ServiceExecutor";
import ImageTaggingService from "./ImageTaggingService";
import ClarifaiService from "./services/ClarifaiService";
import ImaggaService from "./services/ImaggaService";
import Debug = require("debug");
const debug = Debug("ImageTagger");

/**
* Image auto-tagging service. Uses service executor for managing several
* image auto-tagging services
*/
export default class ImageTagger {

    private static services: Map<string, ImageTaggingService> = new Map()
    .set("ClarifaiService", new ClarifaiService())
    .set("ImaggaService", new ImaggaService());

    private sim: number;
    private enabled: boolean;
    private serviceExecutor: ServiceExecutor<ImageTaggingService>;

    constructor(config: {enabled: boolean, services: string[], similarityThreshold: number}) {
        this.sim = config.similarityThreshold || 20;
        this.enabled = config.enabled === true;
        const serviceNames = config.services || [];
        this.serviceExecutor = new ServiceExecutor(ImageTagger.services.size, 30000);
        serviceNames.forEach((serviceName) => {
            if (ImageTagger.services.has(serviceName)) {
                this.serviceExecutor.addService(ImageTagger.services.get(serviceName));
            }
        });
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public disable(): void {
        this.enabled = false;
    }

    public enable(): void {
        this.enabled = true;
    }

    public async tagByPublicURL(url: string): Promise<string[]> {
        let tags: string[] = new Array<string>();
        async function method(service: ImageTaggingService) {
            return await service.tagByPublicURL(url, this.sim);
        }
        if (this.enabled && this.serviceExecutor.hasServices()) {
            debug("tagging by url...");
            try {
                tags = await this.serviceExecutor.execute(method.bind(this));
            }catch (e) {
                console.error(e);
                console.error("ImageTagger: Tagging by URL failed.");
                return Promise.reject(new Error("Tagging by URL failed."));
            }
        }
        debug(`tags: ${tags}`);
        return tags;
    }

    public async tagByBase64(base64: string): Promise<string[]> {
        let tags: string[] = new Array<string>();
        async function method(service: ImageTaggingService) {
            return await service.tagByBase64(base64, this.sim);
        }
        if (this.enabled && this.serviceExecutor.hasServices()) {
            debug("tagging by base64...");
            try {
                tags = await this.serviceExecutor.execute(method.bind(this));
            }catch (e) {
                console.error(e);
                console.error("ImageTagger: Tagging by Base64 failed.");
                return Promise.reject(new Error("Tagging by Base64 failed."));
            }
        }
        debug(`tags: ${tags}`);
        return tags;
    }
}
