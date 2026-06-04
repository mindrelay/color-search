"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const md5 = require("md5");
const murmurhash = require("murmurhash");
const Vector_1 = require("../common/Vector");
class MinHash {
    /**
    * @param hashCount Number of MinHash functions
    * Different hash functions are created by creating different
    * hash-seeds with md5 hashing function.
    */
    constructor(hashCount) {
        this.hashSalts = [];
        for (let i = 0; i < hashCount; i++) {
            this.hashSalts.push(md5(i).toString());
        }
    }
    /** Create MinHash signature
    * @param terms Terms/words set to hash
    * @return MinHash signature vector
    */
    hash(terms) {
        const minHashes = terms && terms.length > 0 ?
            new Array(this.hashSalts.length).fill(Number.POSITIVE_INFINITY) : [];
        for (let i = 0, j = minHashes.length; i < j; i++) {
            for (const term of terms) {
                const hash = murmurhash.v3(term + this.hashSalts[i]);
                if (hash < minHashes[i]) {
                    minHashes[i] = hash;
                }
            }
        }
        return new Vector_1.default(minHashes);
    }
    /** Create MinHash signature with LSH bands
    * @param terms Terms/words set to hash
    * @param bandWidth Number of MinHashes in each LSH band
    * @return MinHash LSH signature vector
    */
    hashWithBands(terms, bandWidth) {
        const minHashes = this.hash(terms).getValues();
        const fullHash = [];
        let k = 0;
        for (const hash of minHashes) {
            if (k > 0 && k < bandWidth) {
                fullHash[fullHash.length - 1].push(hash);
                k++;
            }
            else {
                fullHash.push([hash]);
                k = (k === bandWidth - 1) ? 0 : 1;
            }
        }
        return new Vector_1.default(fullHash.map((val) => murmurhash.v3(val.join(""))));
    }
    /** Calculate similarity between two MinHash signatures
    * @return Similarity value between 0 and 1
    */
    similarity(s1, s2) {
        if (s1.getDimensions() !== s2.getDimensions()) {
            return 0;
        }
        const k = s1.getDimensions();
        let sum = 0;
        for (let i = 0; i < k; i++) {
            sum += s1.get(i) === s2.get(i) ? 1 : 0;
        }
        return sum / k;
    }
}
exports.default = MinHash;
