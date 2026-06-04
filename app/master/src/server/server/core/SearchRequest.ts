import {ChiSquare, Euclidean, PointsDistance, S2JSD} from "./common/Distance";
import TextUtil from "./common/TextUtil";
import {Descriptor, DescriptorBuilder} from "./descriptors/DescriptorBuilder";
import ImageDTO from "./dto/ImageDTO";

export default class SearchRequest {

    private static distances: Map<string, PointsDistance> = new Map()
    .set("euclidean", new Euclidean())
    .set("chisquare", new ChiSquare())
    .set("s2jsd", new S2JSD());

    /** Create SearchRequest instance
    * @param colors User color input
    * @param words User words input
    * @param querySettings User search settings
    * @param config Search configuraion object
    * @return Promise of SearchRequest
    */
    public static async create(colors: any[], words: string[], querySettings, config): Promise<SearchRequest> {
        const setOfWords = TextUtil.uniqSet(words);
        return DescriptorBuilder.createFromQuery(colors, setOfWords)
        .then((descriptor) => {
            if (descriptor instanceof Descriptor) {
                return new SearchRequest(descriptor, querySettings, config);
            }else {
                throw new Error("Request build failed");
            }
        });
    }

    public distance: PointsDistance;
    public similarityLevel: number;
    public checkSemanticSimilarity: boolean;
    public descriptor: Descriptor;
    public searchMode: string;
    public maxResult: number;
    public textFeatureWeight: number;
    private distanceName: string;

    private constructor(descriptor: Descriptor, settings: {searchMode: string,
                        similarityLevel: number, distance: string, checkSemanticSimilarity: boolean },
                        config: {similarityThreshold: number,
                        defaultDistance: string, maxResult: number, textFeatureWeight: number }) {
        if (descriptor instanceof Descriptor && settings && config) {
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
        }else {
            throw new Error("Invalid constructor arguments");
        }
    }

    public toJSON(): any {
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
