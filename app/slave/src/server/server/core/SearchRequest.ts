// tslint:disable:no-string-literal
import {ChiSquare, Euclidean, PointsDistance, S2JSD} from "./common/Distance";
import {Descriptor} from "./descriptors/Descriptors";

export default class SearchRequest {

    public distance: PointsDistance;
    public similarityLevel: number;
    public checkSemanticSimilarity: boolean;
    public descriptor: Descriptor;
    public searchMode: string;
    public maxResult: number;
    public textFeatureWeight: number;

    private constructor(distance: PointsDistance, similarityLevel: number,
                        checkSemanticSimilarity: boolean, descriptor: Descriptor,
                        searchMode: string, maxResult: number, textFeatureWeight: number) {
        this.distance = distance;
        this.similarityLevel = similarityLevel;
        this.checkSemanticSimilarity = checkSemanticSimilarity;
        this.descriptor = descriptor;
        this.searchMode = searchMode;
        this.maxResult = maxResult;
        this.textFeatureWeight = textFeatureWeight;
    }

    private static distances = new Map()
        .set("euclidean", new Euclidean())
        .set("chisquare", new ChiSquare())
        .set("s2jsd", new S2JSD());

    public static set(o: any): SearchRequest {
        const descriptor = new Descriptor(o.descriptor);
        const distance = SearchRequest.distances.get(o.distanceName);
        const similarityLevel = o.similarityLevel;
        const checkSemanticSimilarity = o.checkSemanticSimilarity;
        const searchMode = o.searchMode;
        const maxResult = o.maxResult;
        const textFeatureWeight = o.textFeatureWeight;
        return new SearchRequest(distance, similarityLevel, checkSemanticSimilarity,
        descriptor, searchMode, maxResult, textFeatureWeight);
    }
}
