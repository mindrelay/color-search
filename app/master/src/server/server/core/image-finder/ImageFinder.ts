import Cluster from "../cluster/Cluster";
import ResultDTO from "../dto/ResultDTO";
import {Index} from "../index/Index";
import SearchRequest from "../SearchRequest";
import Comparator from "./Comparator";
import ResultSetSorter from "./ResultSetSorter";
import Debug = require("debug");
const debug = Debug("ImageFinder");

/** Provides method for searching for similar images */
export default class ImageFinder {

    private index: Index;
    private sorter: ResultSetSorter;

    constructor(index: Index) {
        this.sorter = new ResultSetSorter();
        this.index = index;
    }

    /** Searching for similar images
    * In default settings uses LSH for acceleration of search process.
    * Result set sorter is used for sorting the result set.
    * @param request Search request object
    * @return Promise for result set of ResultDTO objects
    */
    public async findSimilarImages(request: SearchRequest): Promise<ResultDTO[]> {
        let results: [ResultDTO[], ResultDTO[][]];
        let resultSet = new Array<ResultDTO>();
        const histogram = request.descriptor.histogram;
        const sum = histogram.getValues().reduce((acc, val) => acc + val);
        if (sum > 0) {
            try {
                results = await Promise.all([this.find(request), Cluster.findSimilarImages(request)]);
                debug(`images found on master: ${results[0].length}`);
                debug(`images found on slaves:  ${results[1].reduce((acc, value) => acc + value.length, 0)}`);
                resultSet = this.sorter.mergeResults(results[0], results[1]);
            } catch (e) {
                console.error(e);
            }
            results = null;
            if (resultSet.length > request.maxResult) {
                resultSet = resultSet.slice(0, request.maxResult);
            }
        }
        debug("found images: " + resultSet.length);
        return resultSet;
    }

    private async find(request: SearchRequest): Promise<ResultDTO[]> {
        const comparator = new Comparator(request);
        const sorter = new ResultSetSorter();
        let resultSet = new Array<ResultDTO>();
        if (request.searchMode === "regular") {
            debug("query index...");
            resultSet = await this.index.query(comparator, request.maxResult);
        }else {
            resultSet = await this.index.linearQuery(comparator, request.maxResult);
        }
        this.sorter.sort(resultSet);
        return resultSet;
    }
}
