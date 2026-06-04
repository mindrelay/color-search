"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = require("../common/Vector");
const Debug = require("debug");
const debug = Debug("ImageDescriptor");
/** Descriptor super class*/
class Descriptor {
    constructor(o) {
        this.histogram = o && o.histogram ? new Vector_1.default(o.histogram) : new Vector_1.default();
        this.mhSignature = o && o.mhSignature ? new Vector_1.default(o.mhSignature) : new Vector_1.default();
        this.textEmbedding = o && o.textEmbedding ? new Vector_1.default(o.textEmbedding) : new Vector_1.default();
    }
    toJSON() {
        return {
            histogram: this.histogram.getValues(),
            mhSignature: this.mhSignature.getValues(),
            textEmbedding: this.textEmbedding.getValues(),
        };
    }
}
exports.Descriptor = Descriptor;
/** Image descriptor class describes features and meta-info for images in database*/
class ImageDescriptor extends Descriptor {
    constructor(o) {
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
    toJSON() {
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
exports.ImageDescriptor = ImageDescriptor;
