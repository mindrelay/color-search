"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ImageURLResolver_1 = require("../common/ImageURLResolver");
class ResultDTO {
    constructor(desc, score, rank) {
        this.url = ImageURLResolver_1.default.resolveURL(desc, desc.url);
        this.originalURL = ImageURLResolver_1.default.resolveURL(desc, desc.originalURL);
        this.previewURL = ImageURLResolver_1.default.resolveURL(desc, desc.previewURL);
        this.score = score;
        this.id = desc.id;
        this.source = desc.source;
        this.owner = desc.owner;
        this.title = desc.title;
        this.rank = rank;
    }
}
exports.default = ResultDTO;
