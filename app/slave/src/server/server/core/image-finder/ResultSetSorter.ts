import Debug = require("debug");
import ResultDTO from "../dto/ResultDTO";
const debug = Debug("ResultSetSorter");

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
}
