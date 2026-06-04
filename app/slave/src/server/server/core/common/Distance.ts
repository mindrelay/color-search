import Vector from "./Vector";

interface PointsDistance {
    calculate(p1: Vector, p2: Vector): number;
    maxL1NormalizedPointsDistance(): number;
}

class Euclidean implements PointsDistance {

    public calculate(p1: Vector, p2: Vector): number {
        if (p1.getDimensions() !== p2.getDimensions()) {
            throw new Error("Points must have identical number of dimensions!");
        }
        let dist: number = 0;
        for (let i = 0, l = p1.getDimensions(); i < l; i++) {
            dist += Math.pow(p1.get(i) - p2.get(i), 2);
        }
        return Math.sqrt(dist);
    }

    public maxL1NormalizedPointsDistance(): number {
        return Math.sqrt(2);
    }
}

class ChiSquare implements PointsDistance {

    public calculate(p1: Vector, p2: Vector): number {
        if (p1.getDimensions() !== p2.getDimensions()) {
            throw new Error("Points must have identical number of dimensions");
        }
        let dist: number = 0;
        for (let i = 0, l = p1.getDimensions(); i < l; i++) {
            if (!(p1.get(i) === p2.get(i))) {
                dist += Math.pow(p1.get(i) - p2.get(i), 2) / (p1.get(i) + p2.get(i));
             }
        }
        // return dist;
        return Math.sqrt(dist);
    }

    public maxL1NormalizedPointsDistance(): number {
        // return 2;
        return 1.4142;
    }
}

class S2JSD implements PointsDistance {

    public calculate(p1: Vector, p2: Vector): number {
        if (p1.getDimensions() !== p2.getDimensions()) {
            throw new Error("Points must have identical number of dimensions!");
        }
        let dist: number = 0;
        for (let i = 0, l = p1.getDimensions(); i < l; i++) {
            if (!(p1.get(i) === p2.get(i))) {
                dist += Math.pow(p1.get(i) - p2.get(i), 2) / (p1.get(i) + p2.get(i));
            }
        }
        return Math.sqrt(1 / 2 * dist);
    }

    public maxL1NormalizedPointsDistance(): number {
        return 1;
    }
}

export {PointsDistance, Euclidean, ChiSquare, S2JSD};
