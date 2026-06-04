import Host from "../Host";
import Couchbase from "./databases/Couchbase";
import MongoDB from "./databases/MongoDB";

export default class LocalHost implements Host {

    private serverUrl: string;
    private dataBase: any;
    private port: any;
    private ip: string;

    constructor(database: string) {
        this.serverUrl = "http://<slave-host>:3000";
        this.port = 3000;
        this.ip = "<slave-host>";
        switch (database.toLowerCase()) {
            case "couchbase" : this.dataBase = new Couchbase(); break;
            default: this.dataBase = new MongoDB(); break;
        }
    }

    public getServerUrl(): string {
        return this.serverUrl;
    }

    public getIp(): string {
        return this.ip;
    }

    public getPort(): any {
        return this.port;
    }

    public getDb() {
        return this.dataBase;
    }
}
