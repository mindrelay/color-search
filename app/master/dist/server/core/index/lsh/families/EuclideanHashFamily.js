"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HashFamily_1 = require("../HashFamily");
const EuclideanHash_1 = require("./EuclideanHash");
class EuclideanHashFamily extends HashFamily_1.default {
    constructor(dimensions, w) {
        super();
        this.dimensions = Math.round(dimensions);
        this.w = w;
    }
    createHashFunction() {
        return new EuclideanHash_1.default(this.dimensions, this.w);
    }
}
exports.default = EuclideanHashFamily;
