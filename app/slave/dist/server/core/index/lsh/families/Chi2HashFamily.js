"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HashFamily_1 = require("../HashFamily");
const Chi2Hash_1 = require("./Chi2Hash");
class Chi2HashFamily extends HashFamily_1.default {
    constructor(dimensions, w) {
        super();
        this.dimensions = Math.round(dimensions);
        this.w = w;
    }
    createHashFunction() {
        return new Chi2Hash_1.default(this.dimensions, this.w);
    }
}
exports.default = Chi2HashFamily;
