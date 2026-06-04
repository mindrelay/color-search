"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceExecutor_1 = require("../common/ServiceExecutor");
const ClarifaiService_1 = require("./services/ClarifaiService");
const ImaggaService_1 = require("./services/ImaggaService");
const Debug = require("debug");
const debug = Debug("ImageTagger");
/**
* Image auto-tagging service. Uses service executor for managing several
* image auto-tagging services
*/
class ImageTagger {
    constructor(config) {
        this.sim = config.similarityThreshold || 20;
        this.enabled = config.enabled === true;
        const serviceNames = config.services || [];
        this.serviceExecutor = new ServiceExecutor_1.default(ImageTagger.services.size, 30000);
        serviceNames.forEach((serviceName) => {
            if (ImageTagger.services.has(serviceName)) {
                this.serviceExecutor.addService(ImageTagger.services.get(serviceName));
            }
        });
    }
    isEnabled() {
        return this.enabled;
    }
    disable() {
        this.enabled = false;
    }
    enable() {
        this.enabled = true;
    }
    tagByPublicURL(url) {
        return __awaiter(this, void 0, void 0, function* () {
            let tags = new Array();
            function method(service) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield service.tagByPublicURL(url, this.sim);
                });
            }
            if (this.enabled && this.serviceExecutor.hasServices()) {
                debug("tagging by url...");
                try {
                    tags = yield this.serviceExecutor.execute(method.bind(this));
                }
                catch (e) {
                    console.error(e);
                    console.error("ImageTagger: Tagging by URL failed.");
                    return Promise.reject(new Error("Tagging by URL failed."));
                }
            }
            debug(`tags: ${tags}`);
            return tags;
        });
    }
    tagByBase64(base64) {
        return __awaiter(this, void 0, void 0, function* () {
            let tags = new Array();
            function method(service) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield service.tagByBase64(base64, this.sim);
                });
            }
            if (this.enabled && this.serviceExecutor.hasServices()) {
                debug("tagging by base64...");
                try {
                    tags = yield this.serviceExecutor.execute(method.bind(this));
                }
                catch (e) {
                    console.error(e);
                    console.error("ImageTagger: Tagging by Base64 failed.");
                    return Promise.reject(new Error("Tagging by Base64 failed."));
                }
            }
            debug(`tags: ${tags}`);
            return tags;
        });
    }
}
ImageTagger.services = new Map()
    .set("ClarifaiService", new ClarifaiService_1.default())
    .set("ImaggaService", new ImaggaService_1.default());
exports.default = ImageTagger;
