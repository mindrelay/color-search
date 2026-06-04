import Vector from "../common/Vector";
import {ImageDescriptor} from "../descriptors/Descriptors";

export interface ImagesNodeDAO {
    countForNode(): Promise<number>;
    iterateNode(callback: (image: ImageDescriptor) => void, max: number): Promise<void>;
}
