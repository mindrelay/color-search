"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const debug = Debug("ResultSetSorter");
/** Sorts the result set of similar images by rank
*/
class ResultSetSorter {
    sort(resultSet) {
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
exports.default = ResultSetSorter;
