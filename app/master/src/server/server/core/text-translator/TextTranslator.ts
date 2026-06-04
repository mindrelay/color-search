import ServiceExecutor from "../common/ServiceExecutor";
import GoogleService from "./services/GoogleService";
import TranslationService from "./TranslationService";
import Debug = require("debug");
const debug = Debug("TextTranslator");

/**
* Text translation. Uses service executor for managing several
* translation services
*/
export default class TextTranslator {

    private static services: Map<string, TranslationService> = new Map()
    .set("GoogleService", new GoogleService());

    private enabled: boolean;
    private serviceExecutor: ServiceExecutor<TranslationService>;

    constructor(config: {enabled: boolean, services: string[]}) {
        this.enabled = config.enabled === true;
        const serviceNames = config.services || [];
        this.serviceExecutor = new ServiceExecutor(TextTranslator.services.size, 30000);
        serviceNames.forEach((serviceName) => {
            if (TextTranslator.services.has(serviceName)) {
                this.serviceExecutor.addService(TextTranslator.services.get(serviceName));
            }
        });
    }

    public isEnabled(): boolean {
        return this.enabled;
    }

    public enable(): void {
        this.enabled = true;
    }

    public disable(): void {
        this.enabled = false;
    }

    /**
    * Translate text
    * @param text Text for translation
    * @returns Promise for translated text
    */
    public async translate(text: string, language: string = "en"): Promise<string> {
        let translated = text;
        debug("text for translation: " + text);
        async function method(service: TranslationService) {
            return await service.translate(text, language);
        }
        if (this.enabled && this.serviceExecutor.hasServices()) {
            try {
                debug("translate...");
                translated = await this.serviceExecutor.execute(method);
            }catch (e) {
                console.error("Translator: Translation failed.");
                return Promise.reject(new Error("Translation failed."));
            }
        }
        debug("translated: " + translated);
        return translated;
    }
}
