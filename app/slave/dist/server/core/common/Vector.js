"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
* Vector
*/
class Vector {
    constructor(arr) {
        this.values = arr ? Array.from(arr) : new Array();
    }
    set(dimension, value) {
        this.values[dimension] = value;
    }
    get(dimension) {
        return this.values[dimension];
    }
    getDimensions() {
        return this.values.length;
    }
    /**
    * Calculate dot product of two vectors
    * @param vector Vector
    * @return number
    */
    dotProduct(vector) {
        if (this.getDimensions() !== vector.getDimensions()) {
            throw new Error("Vectors must have equal number of dimensions.");
        }
        const values = vector.getValues();
        let sum = 0;
        let i = this.values.length;
        while (i--) {
            sum += this.values[i] * values[i];
        }
        return sum;
    }
    /**
    * Add vector
    * @param vector Vector
    * @param mutate If mutate flag is set, the current Vector will be mutated.
    * @return new Vector or itself
    */
    add(vector, mutate = false) {
        if (this.getDimensions() !== vector.getDimensions()) {
            throw new Error("Vectors must have equal number of dimensions.");
        }
        const values = vector.getValues();
        const vec = mutate ? this.values : [];
        let i = this.values.length;
        while (i--) {
            vec[i] = this.values[i] + values[i];
        }
        return mutate ? this : new Vector(vec);
    }
    /**
    * Subtraction of vector
    * @param vector Vector
    * @param mutate If mutate flag is set, the current Vector will be mutated.
    * @return new Vector or itself
    */
    minus(vector, mutate = false) {
        if (this.getDimensions() !== vector.getDimensions()) {
            throw new Error("Vectors must have equal number of dimensions.");
        }
        const values = vector.getValues();
        const vec = mutate ? this.values : [];
        let i = this.values.length;
        while (i--) {
            vec[i] = this.values[i] - values[i];
        }
        return mutate ? this : new Vector(vec);
    }
    /**
    * Scalar multiplication
    * @param scalar Scalar
    * @param mutate If mutate flag is set, the current Vector will be mutated.
    */
    scalarMultiplication(scalar, mutate = false) {
        const vec = mutate ? this.values : [];
        let i = this.values.length;
        while (i--) {
            vec[i] = this.values[i] * scalar;
        }
        return mutate ? this : new Vector(vec);
    }
    /**
    * L2 normalization
    */
    normalizeL2() {
        const length = this.length();
        if (length && length > 0) {
            let i = this.values.length;
            while (i--) {
                this.values[i] = this.values[i] / length;
            }
        }
        return this;
    }
    /**
    * L1 normalization
    */
    normalizeL1() {
        const sum = this.sum();
        if (sum && sum > 0) {
            let i = this.values.length;
            while (i--) {
                this.values[i] = this.values[i] / sum;
            }
        }
        return this;
    }
    /**
    * Create sum of Vector values
    */
    sum() {
        let sum = 0;
        let i = this.values.length;
        while (i--) {
            sum += this.values[i];
        }
        return sum;
    }
    /**
    * Vector length
    */
    length() {
        let sum = 0;
        let i = this.values.length;
        while (i--) {
            sum += Math.pow(this.values[i], 2);
        }
        return Math.sqrt(sum);
    }
    getValues() {
        return this.values;
    }
    toJSON() {
        return this.values;
    }
}
exports.default = Vector;
