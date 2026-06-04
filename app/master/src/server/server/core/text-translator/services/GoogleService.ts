import googleTranslate = require("google-translate-api");
import TranslationService from "../TranslationService";

export default class GoogleService implements TranslationService {

    /**
    * Translate text into english
    * @param text Text for translation
    * @returns Promise for translated text
    */
    public async translate(text: string, language: string = "en"): Promise<string> {
        return await googleTranslate(text, {to: language})
        .then((res) => {
            if (res && res.text !== undefined) {
                return res.text;
            }else {
                console.error("GoogleService: Error");
                return Promise.reject(new Error("GoogleService error"));
            }
        });
    }
}
