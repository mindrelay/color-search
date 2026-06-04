import gaussian = require("box-muller");
import Vector from "../../../common/Vector";
import HashFunction from "../HashFunction";

export default class S2JSDHash implements HashFunction {

    private projection: Vector;
    private b: number;
    private W: number;

    constructor(dimensions: number, w: number) {
        this.projection = new Vector();
        this.b = Math.random();
        this.W = w;
        for (let i = 0; i < dimensions; i++) {
            this.projection.set(i, Math.abs(gaussian()));
        }
    }

    public hash(vector: Vector): number {
        const hashValue = ((Math.sqrt(((4 * this.projection.dotProduct(vector))
        / Math.pow(this.W, 2)) + 1) - 1) / 2) + this.b;
        return Math.floor(hashValue);
    }
}
