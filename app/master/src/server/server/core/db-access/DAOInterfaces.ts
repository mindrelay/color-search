import Vector from "../common/Vector";
import {ImageDescriptor} from "../descriptors/Descriptors";
import ResultDTO from "../dto/ResultDTO";
import Comparator from "../image-finder/Comparator";
import WordEmbedding from "../text-similarity/WordEmbedding";

export interface ImagesDAO {
    saveMany(descriptors: ImageDescriptor[]): Promise<ImageDescriptor[]>;
    delete(id: number): Promise<void>;
    countForNode(): Promise<number>;
    iterateNode(callback: (image: ImageDescriptor) => void, max: number): Promise<void>;
}

export interface VectorSemanticsDAO {
    getTextEmbedding(terms: string[]): Promise<Vector>;
    saveMany(wordEmbeddings: WordEmbedding[]): Promise<void>;
    count(): Promise<number>;
    clear(): Promise<void>;
}
