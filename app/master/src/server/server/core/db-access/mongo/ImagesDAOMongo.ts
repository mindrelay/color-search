import {ImageDescriptor} from "../../descriptors/Descriptors";
import ResultDTO from "../../dto/ResultDTO";
import Settings from "../../Settings";
import {ImagesDAO} from "../DAOInterfaces";
import Debug = require("debug");
const debug = Debug("ImagesDAOMongo");

export default class ImagesDAOMongo implements ImagesDAO {

    private db: any;
    private nodeId: number;
    private images: string;

    constructor() {
        this.db = Settings.db();
        this.nodeId = Settings.global().id;
        this.images = "imagesWang2";
    }

    public async delete(id: number): Promise<void> {
        try {
            const collection = await this.db.connection(this.images);
            await collection.deleteOne({id});
        } catch (e) {
            console.error(e);
        }
    }

    public async saveMany(descriptors: ImageDescriptor[]): Promise<ImageDescriptor[]> {
        let saved = new Array<number>();
        if (descriptors && descriptors.length > 0) {
            debug("saving...");
            try {
                const collection = await this.db.connection(this.images);
                await collection.createIndex({id: 1}, {unique: true});
                saved = await this.save(collection, descriptors);
                debug("saving successful");
            }catch (err) {
                console.error(err);
                saved = [];
            }
        }
        return descriptors.filter((desc) => saved.includes(desc.id));
    }

    /** Amount of images in database on master
    * @return Number of images in master database
    */
    public async countForNode(): Promise<number> {
        try {
            const collection = await this.db.connection(this.images);
            return await collection.count();
        } catch (e) {
            console.error(e);
            return 0;
        }
    }

    public async iterateNode(callback: (image) => void, max: number = null): Promise<void> {
        const collection = await this.db.connection(this.images);
        return new Promise<void>((res, rej) => {
            let count = 0;
            const cursor = collection.find({node: this.nodeId});
            cursor.batchSize(1000)
            .forEach((doc) => {
                if (max && count >= max) {
                    res();
                    cursor.close();
                }
                count++;
                callback(new ImageDescriptor(doc));
            },
            (end) => {
                res();
            });
        });
    }

    private async save(collection, descs: ImageDescriptor[]): Promise<number[]> {
        return await new Promise<number[]>((res, rej) =>
            collection.insertMany(descs.map((desc) => desc.toJSON()), {ordered: false}, (err, result) => {
                if (err && err.code === 11000) {
                    const ids = Array.from(result.getInsertedIds()).map((o: {_id}) => o._id);
                    collection.find({_id: {$in: ids}}).toArray()
                    .then((docs) => res(docs ? Array.from(docs).map((val: any) => val.id) : []))
                    .catch((e) => rej(e));
                } else if (err) {
                    rej(err);
                } else {
                    res(result.ops ? Array.from(result.ops).map((val: any) => val.id) : []);
                }
            })
        );
    }
}
