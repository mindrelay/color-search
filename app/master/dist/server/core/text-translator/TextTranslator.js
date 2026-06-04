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
const GoogleService_1 = require("./services/GoogleService");
const Debug = require("debug");
const debug = Debug("TextTranslator");
/**
* Text translation. Uses service executor for managing several
* translation services
*/
class TextTranslator {
    constructor(config) {
        this.enabled = config.enabled === true;
        const serviceNames = config.services || [];
        this.serviceExecutor = new ServiceExecutor_1.default(TextTranslator.services.size, 30000);
        serviceNames.forEach((serviceName) => {
            if (TextTranslator.services.has(serviceName)) {
                this.serviceExecutor.addService(TextTranslator.services.get(serviceName));
            }
        });
    }
    isEnabled() {
        return this.enabled;
    }
    enable() {
        this.enabled = true;
    }
    disable() {
        this.enabled = false;
    }
    /**
    * Translate text
    * @param text Text for translation
    * @returns Promise for translated text
    */
    translate(text, language = "en") {
        return __awaiter(this, void 0, void 0, function* () {
            let translated = text;
            debug("text for translation: " + text);
            function method(service) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield service.translate(text, language);
                });
            }
            if (this.enabled && this.serviceExecutor.hasServices()) {
                try {
                    debug("translate...");
                    translated = yield this.serviceExecutor.execute(method);
                }
                catch (e) {
                    console.error("Translator: Translation failed.");
                    return Promise.reject(new Error("Translation failed."));
                }
            }
            debug("translated: " + translated);
            return translated;
        });
    }
}
TextTranslator.services = new Map()
    .set("GoogleService", new GoogleService_1.default());
exports.default = TextTranslator;
