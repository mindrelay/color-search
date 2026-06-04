import gaussian = require("box-muller");
import Vector from "../../../common/Vector";
import HashFunction from "../HashFunction";

export default class EuclideanHash implements HashFunction {

    private projection: Vector;
    private b: number;
    private w: number;

    constructor(dimensions: number, w: number) {
        this.projection = new Vector();
        this.b = Math.random() * w;
        this.w = w;
        for (let i = 0; i < dimensions; i++) {
            this.projection.set(i, gaussian());
        }
    }

    public hash(vector: Vector): number {
        const hashValue = (vector.dotProduct(this.projection) + this.b) / this.w;
        return Math.floor(hashValue);
    }
}
