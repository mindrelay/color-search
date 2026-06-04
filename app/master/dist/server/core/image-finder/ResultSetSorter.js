"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const debug = Debug("ResultSetSorter");
const merge = require("merge-k-sorted-arrays");
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
    mergeResults(r1, r2) {
        const result = r2 && Array.isArray(r2) && Array.isArray(r2[0]) ?
            r2 : new Array(new Array());
        result.push(r1 && Array.isArray(r1) ? r1 : new Array());
        return merge(result, { comparator: (a, b) => b.rank - a.rank });
    }
}
exports.default = ResultSetSorter;
