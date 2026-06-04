"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ImageURLResolver_1 = require("../common/ImageURLResolver");
class ResultDTO {
    constructor(dbImage, score, rank) {
        this.url = ImageURLResolver_1.default.resolveURL(dbImage, dbImage.url);
        this.originalURL = ImageURLResolver_1.default.resolveURL(dbImage, dbImage.originalURL);
        this.previewURL = ImageURLResolver_1.default.resolveURL(dbImage, dbImage.previewURL);
        this.score = score;
        this.id = dbImage.id;
        this.source = dbImage.source;
        this.owner = dbImage.owner;
        this.title = dbImage.title;
        this.rank = rank;
    }
}
exports.default = ResultDTO;
