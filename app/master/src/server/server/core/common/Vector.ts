/**
* Vector
*/
export default class Vector {

    private values: number [];

    constructor(arr?: number[]) {
        this.values = arr ? Array.from(arr) : new Array<number>();
    }

    public set(dimension: number, value: number): void {
        this.values[dimension] = value;
    }

    public get(dimension: number): number {
        return this.values[dimension];
    }

    public getDimensions(): number {
        return this.values.length;
    }

    /**
    * Calculate dot product of two vectors
    * @param vector Vector
    * @return number
    */
    public dotProduct(vector: Vector): number {
        if (this.getDimensions() !== vector.getDimensions()) {
            throw new Error ("Vectors must have equal number of dimensions.");
        }
        const values = vector.getValues();
        let sum: number = 0;
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
    public add(vector: Vector, mutate: boolean = false): Vector {
        if (this.getDimensions() !== vector.getDimensions()) {
            throw new Error ("Vectors must have equal number of dimensions.");
        }
        const values = vector.getValues();
        const vec: number[] = mutate ? this.values : [];
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
    public minus(vector: Vector, mutate: boolean = false): Vector {
        if (this.getDimensions() !== vector.getDimensions()) {
            throw new Error ("Vectors must have equal number of dimensions.");
        }
        const values = vector.getValues();
        const vec: number[] = mutate ? this.values : [];
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
    public scalarMultiplication(scalar: number, mutate: boolean = false): Vector {
        const vec: number[] = mutate ? this.values : [];
        let i = this.values.length;
        while (i--) {
            vec[i] = this.values[i] * scalar;
        }
        return mutate ? this : new Vector(vec);
    }

    /**
    * L2 normalization
    */
    public normalizeL2(): Vector {
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
    public normalizeL1(): Vector {
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
    public sum(): number {
        let sum: number = 0;
        let i = this.values.length;
        while (i--) {
            sum += this.values[i];
        }
        return sum;
    }

    /**
    * Vector length
    */
    public length(): number {
        let sum: number = 0;
        let i = this.values.length;
        while (i--) {
            sum += Math.pow(this.values[i], 2);
        }
        return Math.sqrt(sum);
    }

    public getValues(): number[] {
        return this.values;
    }

    public toJSON(): number[] {
        return this.values;
    }
}
