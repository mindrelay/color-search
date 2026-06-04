import Debug = require("debug");
import {PointsDistance} from "../common/Distance";
import Vector from "../common/Vector";
import {Descriptor, ImageDescriptor} from "../descriptors/Descriptors";
import ResultDTO from "../dto/ResultDTO";
import SearchRequest from "../SearchRequest";
import Settings from "../Settings";
import TextSimilarity from "../text-similarity/TextSimilarity";
const debug = Debug("Comparator");

/** Compares request descriptor with each candidate descriptor */
export default class Comparator {

    private TEXT_WEIGHT: number;
    private COLOR_WEIGHT: number;
    private colorDistanceThreshold: number;
    private textSimilarity: TextSimilarity;
    private maxColorDistance: number;
    private checkSemantics: boolean;
    private colorDistance: PointsDistance;
    private descriptor: Descriptor;

    constructor(request: SearchRequest) {
        this.descriptor = request.descriptor;
        this.colorDistance = request.distance;
        this.colorDistanceThreshold =  (1 - request.similarityLevel / 100) *
        this.colorDistance.maxL1NormalizedPointsDistance();
        this.textSimilarity = new TextSimilarity(Settings.textSimilarity());
        this.TEXT_WEIGHT = request.textFeatureWeight;
        this.COLOR_WEIGHT = 1 - this.TEXT_WEIGHT;
        this.maxColorDistance = this.colorDistance.maxL1NormalizedPointsDistance();
        this.checkSemantics = request.checkSemanticSimilarity;
    }

    public getRequestDescriptor(): Descriptor {
        return this.descriptor;
    }

    /** Compares request descriptor with candidate descriptor.
    * Calculates similarity score and adds similar candidate to the result set.
    * If required, text similarity score will be calculated und used as a rank (sorting criterion).
    * @param candidate Candidate descriptor
    * @param resultSet Result set
    */
    public compare(candidate: ImageDescriptor, resultSet: ResultDTO[]): void {
        const colorDist = this.colorDistance.calculate(this.descriptor.histogram, candidate.histogram);
        if (colorDist <= this.colorDistanceThreshold) {
            let textSim = 0;
            if (this.checkSemantics) {
                textSim = this.textSimilarity.similarityScore(this.descriptor.mhSignature,
                this.descriptor.textEmbedding, candidate.mhSignature, candidate.textEmbedding);
            }
            const score = 1 - colorDist / this.maxColorDistance;
            const rank = this.checkSemantics ?
            (textSim * this.TEXT_WEIGHT) + (this.COLOR_WEIGHT * score) : score;
            resultSet.push(new ResultDTO(candidate, score, rank));
        }
    }
}
