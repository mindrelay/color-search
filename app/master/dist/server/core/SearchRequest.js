"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Distance_1 = require("./common/Distance");
const TextUtil_1 = require("./common/TextUtil");
const DescriptorBuilder_1 = require("./descriptors/DescriptorBuilder");
class SearchRequest {
    constructor(descriptor, settings, config) {
        if (descriptor instanceof DescriptorBuilder_1.Descriptor && settings && config) {
            this.descriptor = descriptor;
            const similarityThreshold = typeof config.similarityThreshold === "number" ?
                config.similarityThreshold : 85;
            const defaultDistance = config.defaultDistance !== undefined ? config.defaultDistance : "euclidean";
            this.searchMode = settings["searchMode"] === "special" ? "special" : "regular";
            this.similarityLevel = (this.searchMode === "special" && settings["similarityLevel"] !== undefined) ?
                parseInt(settings["similarityLevel"].toString(), 10) : similarityThreshold;
            this.similarityLevel = this.similarityLevel < 50 ? similarityThreshold : this.similarityLevel;
            this.distanceName = this.searchMode === "special" && SearchRequest.distances.has(settings["distance"]) ?
                settings["distance"] : defaultDistance.toLowerCase();
            this.distance = SearchRequest.distances.get(this.distanceName);
            this.checkSemanticSimilarity = settings["checkSemanticSimilarity"] === true;
            this.maxResult = typeof config.maxResult === "number" ? config.maxResult : 10000;
            this.textFeatureWeight = typeof config.textFeatureWeight === "number" &&
                config.textFeatureWeight >= 0 && config.textFeatureWeight <= 1 ? config.textFeatureWeight : 0;
        }
        else {
            throw new Error("Invalid constructor arguments");
        }
    }
    /** Create SearchRequest instance
    * @param colors User color input
    * @param words User words input
    * @param querySettings User search settings
    * @param config Search configuraion object
    * @return Promise of SearchRequest
    */
    static create(colors, words, querySettings, config) {
        return __awaiter(this, void 0, void 0, function* () {
            const setOfWords = TextUtil_1.default.uniqSet(words);
            return DescriptorBuilder_1.DescriptorBuilder.createFromQuery(colors, setOfWords)
                .then((descriptor) => {
                if (descriptor instanceof DescriptorBuilder_1.Descriptor) {
                    return new SearchRequest(descriptor, querySettings, config);
                }
                else {
                    throw new Error("Request build failed");
                }
            });
        });
    }
    toJSON() {
        return {
            similarityLevel: this.similarityLevel,
            checkSemanticSimilarity: this.checkSemanticSimilarity,
            descriptor: this.descriptor.toJSON(),
            searchMode: this.searchMode,
            distanceName: this.distanceName,
            maxResult: this.maxResult,
            textFeatureWeight: this.textFeatureWeight
        };
    }
}
SearchRequest.distances = new Map()
    .set("euclidean", new Distance_1.Euclidean())
    .set("chisquare", new Distance_1.ChiSquare())
    .set("s2jsd", new Distance_1.S2JSD());
exports.default = SearchRequest;
