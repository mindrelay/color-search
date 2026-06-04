import Vector from "../common/Vector";
import Debug = require("debug");
const debug = Debug("ImageDescriptor");

/** Descriptor super class*/
export class Descriptor {

    public histogram: Vector;
    public mhSignature: Vector;
    public textEmbedding: Vector;

    constructor(o?) {
        this.histogram = o && o.histogram ? new Vector(o.histogram) : new Vector();
        this.mhSignature = o && o.mhSignature ? new Vector(o.mhSignature) : new Vector();
        this.textEmbedding = o && o.textEmbedding ? new Vector(o.textEmbedding) : new Vector();
    }

    public toJSON() {
        return {
            histogram: this.histogram.getValues(),
            mhSignature: this.mhSignature.getValues(),
            textEmbedding: this.textEmbedding.getValues(),
        };
    }
}

/** Image descriptor class describes features and meta-info for images in database*/
export class ImageDescriptor extends Descriptor {

    public id: number;
    public originId: string;
    public autotags: string[];
    public source: string;
    public url: string;
    public previewURL: string;
    public originalURL: string;
    public owner: string;
    public license: string;
    public title: string;
    public node: number;

    constructor(o?) {
        super(o);
        this.id = o && o.id !== undefined ? Number.parseInt(o.id) : null;
        this.originId = o && o.originId !== undefined ? o.originId : "";
        this.autotags = o && o.autotags ? Array.from(o.autotags) : [];
        this.source = o && o.source !== undefined ? o.source : "";
        this.originalURL = o && typeof o.originalURL === "string" ? o.originalURL : "";
        this.previewURL = o && typeof o.previewURL === "string" ? o.previewURL : "";
        this.url = o && typeof o.url === "string" ? o.url : "";
        this.owner = o && typeof o.owner === "string" ? o.owner : "";
        this.license = o && o.license !== undefined ? o.license : "";
        this.title = o && typeof o.title === "string" ? o.title : "";
        this.node = o && o.node !== undefined ? Number.parseInt(o.node) : null;
    }

    public toJSON() {
        return Object.assign({
            id: this.id,
            originId: this.originId,
            autotags: this.autotags,
            source: this.source,
            url: this.url,
            previewURL: this.previewURL,
            originalURL: this.originalURL,
            owner: this.owner,
            license: this.license,
            title: this.title,
            histogram: this.histogram.getValues(),
            mhSignature: this.mhSignature.getValues(),
            textEmbedding: this.textEmbedding.getValues(),
            node: this.node,
        }, super.toJSON());
    }
}
