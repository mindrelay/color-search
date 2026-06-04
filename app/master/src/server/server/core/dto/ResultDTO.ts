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

    constructor(dbImage: ImageDescriptor, score: number, rank: number) {
        this.url = ImageURLResolver.resolveURL(dbImage, dbImage.url);
        this.originalURL = ImageURLResolver.resolveURL(dbImage, dbImage.originalURL);
        this.previewURL = ImageURLResolver.resolveURL(dbImage, dbImage.previewURL);
        this.score = score;
        this.id = dbImage.id;
        this.source = dbImage.source;
        this.owner = dbImage.owner;
        this.title = dbImage.title;
        this.rank = rank;
    }
}
