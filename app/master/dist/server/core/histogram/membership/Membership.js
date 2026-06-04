"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractMemberships {
    addValueToHistogram(histogram, values, weight = 1) {
        for (let i = 0; i < this.memberships.length; i++) {
            let sum = 0;
            for (const membership of this.memberships[i]) {
                sum += membership.m(values, weight);
            }
            histogram[i] += sum;
        }
    }
    getSize() {
        return this.memberships.length;
    }
}
exports.AbstractMemberships = AbstractMemberships;
class CombinedMembership {
    constructor(...memberships) {
        this.memberships = memberships;
    }
    m(values, weight = 1) {
        if (this.memberships.length !== values.length) {
            throw new Error("Memberships and values must have identical dimensionality!");
        }
        let product = 1;
        for (let i = 0; i < this.memberships.length; i++) {
            product *= this.memberships[i].m(values[i]);
        }
        return product * weight;
    }
    toString() {
        return {
            h: this.memberships[0],
            s: this.memberships[1],
            v: this.memberships[2],
        };
    }
}
exports.CombinedMembership = CombinedMembership;
