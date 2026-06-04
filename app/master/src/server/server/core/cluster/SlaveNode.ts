import {ImageDescriptor} from "../descriptors/Descriptors";
import ResultDTO from "../dto/ResultDTO";
import SearchRequest from "../SearchRequest";
import JsonRPC from "./JsonRPC";
import md5 = require ("md5");
import Debug = require("debug");
const debug = Debug("SlaveNode");

export default class SlaveNode {

    private url: string;
    private secret: string;
    private id: number;
    private timmeout: number;

    constructor(url: string, secret: string, id: number, timeout: number) {
        this.url = url;
        this.secret = md5(`${secret}`);
        this.id = id;
        this.timmeout = timeout;
    }

    public getId(): number {
        return this.id;
    }

    public async saveDescriptors(descriptors: ImageDescriptor[]): Promise<number[]> {
        debug("saving...");
        return await new Promise<number[]>((res, rej) => {
            setTimeout(() => res([]), this.timmeout);
            JsonRPC.request<number[]>(this.url, "saveDescriptors", {descriptors}, this.secret)
            .then((result) => res(result))
            .catch((e) => {
                console.error(e);
                res([]);
            });
        });
    }

    public async deleteDescriptor(id: number): Promise<boolean> {
        return await new Promise<boolean>((res, rej) => {
            setTimeout(() => res(false), this.timmeout);
            JsonRPC.request<boolean>(this.url, "deleteDescriptor", {id}, this.secret)
            .then(() => res())
            .catch((e) => {
                console.error(e);
                res(false);
            });
        });
    }

    public async findImages(request: SearchRequest): Promise<ResultDTO[]> {
        debug("find...");
        return await new Promise<ResultDTO[]>((res, rej) => {
            setTimeout(() => res(new Array<ResultDTO>()), this.timmeout);
            JsonRPC.request<ResultDTO[]>(this.url, "findImages",
            {request: request.toJSON()}, this.secret)
            .then((result: ResultDTO[]) => {
                res(result && result.length > 0 ? Array.from(result) : []);
            })
            .catch((e) => {
                console.error(e);
                res(new Array<ResultDTO>());
            });
        });
    }

    public async spaceAvailable(): Promise<boolean> {
        return await new Promise<boolean>((res, rej) => {
            setTimeout(() => res(false), this.timmeout);
            JsonRPC.request<boolean>(this.url, "spaceAvailable", "", this.secret)
            .then((result: boolean) => res(result))
            .catch((e) => {
                console.error(e);
                res(false);
            });
        });
    }
}
