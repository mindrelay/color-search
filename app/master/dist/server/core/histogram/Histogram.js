"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractHistogram {
    toArray() {
        if (this.complete) {
            return this.histogram;
        }
        else {
            throw new Error("'toArray' method call before 'complete' is not allowed!");
        }
    }
    getSize() {
        return this.histogram.length;
    }
    normalize() {
        let sum = 0;
        for (let i = 0; i < this.histogram.length; i++) {
            sum += this.histogram[i];
        }
        if (sum > 0) {
            for (let i = 0; i < this.histogram.length; i++) {
                this.histogram[i] = this.histogram[i] / sum;
            }
        }
    }
    isDone() {
        return this.complete;
    }
}
exports.AbstractHistogram = AbstractHistogram;
