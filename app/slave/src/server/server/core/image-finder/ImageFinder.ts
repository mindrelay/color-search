import Debug = require("debug");
import ResultDTO from "../dto/ResultDTO";
import {Index} from "../index/Index";
import SearchRequest from "../SearchRequest";
import Comparator from "./Comparator";
import ResultSetSorter from "./ResultSetSorter";
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
        let resultSet = new Array<ResultDTO>();
        const histogram = request.descriptor.histogram;
        const sum = histogram.getValues().reduce((acc, val) => acc + val);
        if (sum > 0) {
            try {
                resultSet = await this.find(request);
            } catch (e) {
                console.error(e);
            }
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
            resultSet = await this.index.query(comparator, 5000);
        } else {
            resultSet = await this.index.linearQuery(comparator, 5000);
        }
        this.sorter.sort(resultSet);
        return resultSet;
    }
}
