// tslint:disable:prefer-for-of
// tslint:disable:max-line-length
// tslint:disable:one-variable-per-declaration
// tslint:disable:prefer-const
import Debug = require("debug");
import {ImageDescriptor} from "../../descriptors/Descriptors";
import ResultDTO from "../../dto/ResultDTO";
import Settings from "../../Settings";
import {ImagesNodeDAO} from "../DAOInterfaces";
const couchbase = require("couchbase");
const debug = Debug("ImagesDAOCouchbase");

export default class ImagesNodeDAOCouchbase  implements ImagesNodeDAO {

    private db: any;
    private nodeId: number;
    private amountQuery: any;

    constructor() {
        this.db = Settings.db();
        this.nodeId = Settings.global().id;
        this.amountQuery = couchbase.N1qlQuery
        .fromString(`SELECT COUNT(*) as count from images WHERE node = ${this.nodeId}`);
    }

    /** Amount of images in database on node
    * @return Number of images on node
    */
    public async countForNode(): Promise<number> {
        const bucket = await this.db.connection("images");
        return await new Promise<number>((res, rej) => {
            bucket.query(this.amountQuery, {}, (err, rows) => {
                if (err) {
                    console.log(err);
                    res(0);
                } else {
                    res(rows && isNaN(rows[0].count) ? 0 : Number.parseInt(rows[0].count));
                }
            });
        });
    }

    public async iterateNode(callback: (image: ImageDescriptor) => void, max: number = Infinity): Promise<void> {
        let count = 0, step = 1000, offset = 0;
        const bucket = await this.db.connection("images");
        await new Promise<void>((res, rej) => {
            const loop = () => {
                if (count < max) {
                    const queryAll = couchbase.N1qlQuery.fromString(`SELECT images.* FROM images WHERE node = ${this.nodeId} LIMIT ${step} OFFSET ${offset}`);
                    bucket.query(queryAll, {}, (err, rows) => {
                        offset += step;
                        if (err) {
                            console.log(err);
                            res();
                        } else if (rows && rows.length > 0) {
                            let i = rows.length;
                            while (i--) {
                                if (count < max) {
                                    callback(new ImageDescriptor(rows[i]));
                                } else {
                                    break;
                                }
                                count ++;
                            }
                            loop();
                        } else {
                            res();
                        }
                    });
                } else {
                    res();
                }
            };
            loop();
        });
    }
}
