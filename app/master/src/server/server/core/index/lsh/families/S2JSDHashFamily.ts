import HashFamily from "../HashFamily";
import HashFunction from "../HashFunction";
import S2JSDHash from "./S2JSDHash";

export default class S2JSDHashFamily extends HashFamily {

    private dimensions: number;
    private w: number;

    constructor(dimensions: number, w: number) {
        super();
        this.dimensions = dimensions;
        this.w = w;
    }

    public createHashFunction(): S2JSDHash {
        return new S2JSDHash(this.dimensions, this.w);
    }
}
