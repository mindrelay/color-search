"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResultDTO_1 = require("../dto/ResultDTO");
const Settings_1 = require("../Settings");
const TextSimilarity_1 = require("../text-similarity/TextSimilarity");
const Debug = require("debug");
const debug = Debug("Comparator");
/** Compares request descriptor with each candidate descriptor */
class Comparator {
    constructor(request) {
        this.descriptor = request.descriptor;
        this.colorDistance = request.distance;
        this.colorDistanceThreshold = (1 - request.similarityLevel / 100) *
            this.colorDistance.maxL1NormalizedPointsDistance();
        this.textSimilarity = new TextSimilarity_1.default(Settings_1.default.textSimilarity());
        this.TEXT_WEIGHT = request.textFeatureWeight;
        this.COLOR_WEIGHT = 1 - this.TEXT_WEIGHT;
        this.maxColorDistance = this.colorDistance.maxL1NormalizedPointsDistance();
        this.checkSemantics = request.checkSemanticSimilarity;
    }
    getRequestDescriptor() {
        return this.descriptor;
    }
    /** Compares request descriptor with candidate descriptor.
    * Calculates similarity score and adds similar candidate to the result set.
    * If required, text similarity score will be calculated und used as a rank (sorting criterion).
    * @param candidate Candidate descriptor
    * @param resultSet Result set
    */
    compare(candidate, resultSet) {
        const colorDist = this.colorDistance.calculate(this.descriptor.histogram, candidate.histogram);
        if (colorDist <= this.colorDistanceThreshold) {
            let textSim = 0;
            if (this.checkSemantics) {
                textSim = this.textSimilarity.similarityScore(this.descriptor.mhSignature, this.descriptor.textEmbedding, candidate.mhSignature, candidate.textEmbedding);
            }
            const score = 1 - colorDist / this.maxColorDistance;
            const rank = this.checkSemantics ?
                (textSim * this.TEXT_WEIGHT) + (this.COLOR_WEIGHT * score) : score;
            resultSet.push(new ResultDTO_1.default(candidate, score, rank));
        }
    }
}
exports.default = Comparator;
