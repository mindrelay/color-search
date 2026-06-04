import {DAOFactory, ImagesNodeDAO} from "../db-access/DAOFactory";
import {Index} from "../index/Index";
import Settings from "../Settings";
import {ImageDescriptor} from "./Descriptors";

export default class ImageDescriptors {

    private dao: ImagesNodeDAO;
    private index: Index;
    private saveLimit: number;

    constructor(index: Index, saveLimit: number) {
        this.dao = DAOFactory.getImagesNodeDAO();
        this.index = index;
        this.saveLimit = saveLimit;
    }

    public async saveMany(descriptors: ImageDescriptor[]): Promise<void> {
        this.index.indexMany(descriptors);
    }

    public async delete(id: number): Promise<void> {
        await this.index.remove(id);
    }

    public async count(): Promise<number> {
        return await this.dao.countForNode();
    }

    public async maxReached(): Promise<boolean> {
        let count = this.saveLimit;
        try {
            count = await this.count();
        } catch (e) {
            console.error(e);
        }
        return count >= this.saveLimit;
    }
}
