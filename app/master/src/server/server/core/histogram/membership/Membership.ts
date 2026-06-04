export interface Membership {
    m(x: number): number;
}

export abstract class AbstractMemberships {
    protected memberships: CombinedMembership[][];

    public addValueToHistogram(histogram: number[], values: number[], weight = 1) {
        for (let i = 0; i < this.memberships.length; i++) {
            let sum = 0;
            for (const membership of this.memberships[i]) {
                sum += membership.m(values, weight);
            }
            histogram[i] += sum;
        }
    }
    public getSize(): number {
        return this.memberships.length;
    }
}

export class CombinedMembership {
    private memberships: Membership[];

    constructor(...memberships: Membership[]) {
        this.memberships = memberships;
    }

    public m(values: number[], weight = 1): number {
        if (this.memberships.length !== values.length) {
            throw new Error("Memberships and values must have identical dimensionality!");
        }

        let product = 1;
        for (let i = 0; i < this.memberships.length; i++) {
            product *= this.memberships[i].m(values[i]);
        }
        return product * weight;
    }

    public toString() {
        return {
            h: this.memberships[0],
            s: this.memberships[1],
            v: this.memberships[2],
        };
    }
}
