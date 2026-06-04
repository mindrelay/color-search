export default interface ImageTaggingService {
    tagByPublicURL(url: string, sim: number): Promise<string[]>;
    tagByBase64(base64: string, sim: number): Promise<string[]>;
}
