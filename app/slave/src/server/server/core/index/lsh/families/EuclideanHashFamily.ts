import HashFamily from "../HashFamily";
import EuclideanHash from "./EuclideanHash";

export default class EuclideanHashFamily extends HashFamily {

    private dimensions: number;
    private w: number;

    constructor(dimensions: number, w: number) {
        super();
        this.dimensions = Math.round(dimensions);
        this.w = w;
    }

    public createHashFunction(): EuclideanHash {
        return new EuclideanHash(this.dimensions, this.w);
    }
}
