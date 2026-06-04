import HashFunction from "./HashFunction";

export default abstract class HashFamily {
    public abstract createHashFunction(): HashFunction;
}
