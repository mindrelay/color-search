export default interface TranslationService {
    translate(text: string, language?: string): Promise<string>;
}
