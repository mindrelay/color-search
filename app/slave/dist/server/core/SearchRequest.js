"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-string-literal
const Distance_1 = require("./common/Distance");
const Descriptors_1 = require("./descriptors/Descriptors");
class SearchRequest {
    constructor(distance, similarityLevel, checkSemanticSimilarity, descriptor, searchMode, maxResult, textFeatureWeight) {
        this.distance = distance;
        this.similarityLevel = similarityLevel;
        this.checkSemanticSimilarity = checkSemanticSimilarity;
        this.descriptor = descriptor;
        this.searchMode = searchMode;
        this.maxResult = maxResult;
        this.textFeatureWeight = textFeatureWeight;
    }
    static set(o) {
        const descriptor = new Descriptors_1.Descriptor(o.descriptor);
        const distance = SearchRequest.distances.get(o.distanceName);
        const similarityLevel = o.similarityLevel;
        const checkSemanticSimilarity = o.checkSemanticSimilarity;
        const searchMode = o.searchMode;
        const maxResult = o.maxResult;
        const textFeatureWeight = o.textFeatureWeight;
        return new SearchRequest(distance, similarityLevel, checkSemanticSimilarity, descriptor, searchMode, maxResult, textFeatureWeight);
    }
}
SearchRequest.distances = new Map()
    .set("euclidean", new Distance_1.Euclidean())
    .set("chisquare", new Distance_1.ChiSquare())
    .set("s2jsd", new Distance_1.S2JSD());
exports.default = SearchRequest;
