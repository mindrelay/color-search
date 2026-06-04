import {MongoClient} from "mongodb";

export default class MongoDB {

    private conn: any;

    constructor() {
        this.conn = null;
    }

    public async connection(collection?: string) {
        if (this.conn == null) {
            const mongoURL = "mongodb://<mongodb-host>:27017/<database-name>";
            try {
                this.conn = await MongoClient.connect(mongoURL);
            }catch (e) {
                console.error("Connection to MongoDB failed.");
                return Promise.reject(new Error("LocalHost MongoDB connection failed."));
            }
        }
        return collection ? this.conn.collection(collection) : this.conn;
    }
}
