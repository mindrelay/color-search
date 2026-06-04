import {ImageDescriptor} from "../descriptors/Descriptors";
import ResultDTO from "../dto/ResultDTO";
import Comparator from "../image-finder/Comparator";

export interface Index {
    index(descriptor: ImageDescriptor): void;
    indexMany(descriptors: ImageDescriptor[]): void;
    query(comparator: Comparator, limit: number): Promise<ResultDTO[]>;
    linearQuery(comparator: Comparator, limit: number): Promise<ResultDTO[]>;
    remove(i: ImageDescriptor | number): void;
    count(): number;
}
