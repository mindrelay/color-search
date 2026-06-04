import ResultDTO from "../dto/ResultDTO";
import Debug = require("debug");
const debug = Debug("ResultSetSorter");
const merge = require("merge-k-sorted-arrays");

/** Sorts the result set of similar images by rank
*/
export default class ResultSetSorter {

    public sort(resultSet: ResultDTO[]): void {
        resultSet.sort((a, b) => {
            if (a.rank > b.rank) {
                return -1;
            }
            if (a.rank < b.rank) {
                return 1;
            }
            return 0;
        });
    }

    public mergeResults(r1: ResultDTO[], r2: ResultDTO[][]): ResultDTO[] {
        const result = r2 && Array.isArray(r2) && Array.isArray(r2[0]) ?
        r2 : new Array<ResultDTO[]>(new Array<ResultDTO>());
        result.push(r1 && Array.isArray(r1) ? r1 : new Array<ResultDTO>());
        return merge(result, {comparator: (a, b) => b.rank - a.rank});
    }
}
