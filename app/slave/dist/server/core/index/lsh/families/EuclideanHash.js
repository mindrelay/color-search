"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gaussian = require("box-muller");
const Vector_1 = require("../../../common/Vector");
class EuclideanHash {
    constructor(dimensions, w) {
        this.projection = new Vector_1.default();
        this.b = Math.random() * w;
        this.w = w;
        for (let i = 0; i < dimensions; i++) {
            this.projection.set(i, gaussian());
        }
    }
    hash(vector) {
        const hashValue = (vector.dotProduct(this.projection) + this.b) / this.w;
        return Math.floor(hashValue);
    }
}
exports.default = EuclideanHash;
