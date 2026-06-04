import HashFamily from "../HashFamily";
import Chi2Hash from "./Chi2Hash";

export default class Chi2HashFamily extends HashFamily {

    private dimensions: number;
    private w: number;

    constructor(dimensions: number, w: number) {
        super();
        this.dimensions = Math.round(dimensions);
        this.w = w;
    }

    public createHashFunction(): Chi2Hash {
        return new Chi2Hash(this.dimensions, this.w);
    }
}
