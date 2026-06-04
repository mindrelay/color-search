"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gaussian = require("box-muller");
const Vector_1 = require("../../../common/Vector");
class Chi2Hash {
    constructor(dimensions, w) {
        this.projection = new Vector_1.default();
        this.b = Math.random();
        // this.w = w;
        this.w = Math.pow(w, 2);
        for (let i = 0; i < dimensions; i++) {
            this.projection.set(i, Math.abs(gaussian()));
        }
    }
    hash(vector) {
        const x = vector.dotProduct(this.projection);
        return Math.floor(((Math.sqrt(((8 * x) / Math.pow(this.w, 2)) + 1) - 1) / 2) + this.b);
    }
}
exports.default = Chi2Hash;
