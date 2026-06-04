import ResultDTO from "../dto/ResultDTO";

export default interface ImageInspectingStrategy {
    imageIsOk(image: ResultDTO): Promise<boolean>;
    sourceName(): string;
}
