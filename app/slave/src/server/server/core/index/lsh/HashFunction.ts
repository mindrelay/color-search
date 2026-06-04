import Vector from "../../common/Vector";

export default interface HashFunction {
    hash(vector: Vector): number;
}
