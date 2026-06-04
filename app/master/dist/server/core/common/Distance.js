"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Euclidean {
    calculate(p1, p2) {
        if (p1.getDimensions() !== p2.getDimensions()) {
            throw new Error("Points must have identical number of dimensions!");
        }
        let dist = 0;
        for (let i = 0, l = p1.getDimensions(); i < l; i++) {
            dist += Math.pow(p1.get(i) - p2.get(i), 2);
        }
        return Math.sqrt(dist);
    }
    maxL1NormalizedPointsDistance() {
        return Math.sqrt(2);
    }
}
exports.Euclidean = Euclidean;
class ChiSquare {
    calculate(p1, p2) {
        if (p1.getDimensions() !== p2.getDimensions()) {
            throw new Error("Points must have identical number of dimensions");
        }
        let dist = 0;
        for (let i = 0, l = p1.getDimensions(); i < l; i++) {
            if (!(p1.get(i) === p2.get(i))) {
                dist += Math.pow(p1.get(i) - p2.get(i), 2) / (p1.get(i) + p2.get(i));
            }
        }
        return dist;
    }
    maxL1NormalizedPointsDistance() {
        return 2;
    }
}
exports.ChiSquare = ChiSquare;
class S2JSD {
    calculate(p1, p2) {
        if (p1.getDimensions() !== p2.getDimensions()) {
            throw new Error("Points must have identical number of dimensions!");
        }
        let dist = 0;
        for (let i = 0, l = p1.getDimensions(); i < l; i++) {
            if (!(p1.get(i) === p2.get(i))) {
                dist += Math.pow(p1.get(i) - p2.get(i), 2) / (p1.get(i) + p2.get(i));
            }
        }
        return Math.sqrt(1 / 2 * dist);
    }
    maxL1NormalizedPointsDistance() {
        return 1;
    }
}
exports.S2JSD = S2JSD;
