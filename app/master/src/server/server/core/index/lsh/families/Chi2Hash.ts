import gaussian = require("box-muller");
import Vector from "../../../common/Vector";
import HashFunction from "../HashFunction";

export default class Chi2Hash implements HashFunction {

    private projection: Vector;
    private b: number;
    private w: number;

    constructor(dimensions: number, w: number) {
        this.projection = new Vector();
        this.b = Math.random();
        // this.w = w;
        this.w = Math.pow(w, 2);
        for (let i = 0; i < dimensions; i++) {
            this.projection.set(i, Math.abs(gaussian()));
        }
    }

    public hash(vector: Vector): number {
        const x = vector.dotProduct(this.projection);
        return Math.floor(((Math.sqrt(((8 * x) / Math.pow(this.w, 2)) + 1) - 1) / 2) + this.b);
    }
}
