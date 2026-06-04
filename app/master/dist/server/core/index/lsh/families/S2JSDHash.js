"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gaussian = require("box-muller");
const Vector_1 = require("../../../common/Vector");
class S2JSDHash {
    constructor(dimensions, w) {
        this.projection = new Vector_1.default();
        this.b = Math.random();
        this.W = w;
        for (let i = 0; i < dimensions; i++) {
            this.projection.set(i, Math.abs(gaussian()));
        }
    }
    hash(vector) {
        const hashValue = ((Math.sqrt(((4 * this.projection.dotProduct(vector))
            / Math.pow(this.W, 2)) + 1) - 1) / 2) + this.b;
        return Math.floor(hashValue);
    }
}
exports.default = S2JSDHash;
