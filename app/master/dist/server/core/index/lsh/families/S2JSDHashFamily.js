"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HashFamily_1 = require("../HashFamily");
const S2JSDHash_1 = require("./S2JSDHash");
class S2JSDHashFamily extends HashFamily_1.default {
    constructor(dimensions, w) {
        super();
        this.dimensions = dimensions;
        this.w = w;
    }
    createHashFunction() {
        return new S2JSDHash_1.default(this.dimensions, this.w);
    }
}
exports.default = S2JSDHashFamily;
