import ImageURLResolver from "../common/ImageURLResolver";
import {ImageDescriptor} from "../descriptors/Descriptors";
import Settings from "../Settings";

export default class ResultDTO {

    public id: number;
    public url: string;
    public previewURL: string;
    public originalURL: string;
    public score: number;
    public source: string;
    public owner: string;
    public title: string;
    public rank: number;

    constructor(desc: ImageDescriptor, score: number, rank: number) {
        this.url = ImageURLResolver.resolveURL(desc, desc.url);
        this.originalURL = ImageURLResolver.resolveURL(desc, desc.originalURL);
        this.previewURL = ImageURLResolver.resolveURL(desc, desc.previewURL);
        this.score = score;
        this.id = desc.id;
        this.source = desc.source;
        this.owner = desc.owner;
        this.title = desc.title;
        this.rank = rank;
    }
}
