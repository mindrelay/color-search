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
const Debug = require("debug");
const Comparator_1 = require("./Comparator");
const ResultSetSorter_1 = require("./ResultSetSorter");
const debug = Debug("ImageFinder");
/** Provides method for searching for similar images */
class ImageFinder {
    constructor(index) {
        this.sorter = new ResultSetSorter_1.default();
        this.index = index;
    }
    /** Searching for similar images
    * In default settings uses LSH for acceleration of search process.
    * Result set sorter is used for sorting the result set.
    * @param request Search request object
    * @return Promise for result set of ResultDTO objects
    */
    findSimilarImages(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let resultSet = new Array();
            const histogram = request.descriptor.histogram;
            const sum = histogram.getValues().reduce((acc, val) => acc + val);
            if (sum > 0) {
                try {
                    resultSet = yield this.find(request);
                }
                catch (e) {
                    console.error(e);
                }
                if (resultSet.length > request.maxResult) {
                    resultSet = resultSet.slice(0, request.maxResult);
                }
            }
            debug("found images: " + resultSet.length);
            return resultSet;
        });
    }
    find(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const comparator = new Comparator_1.default(request);
            const sorter = new ResultSetSorter_1.default();
            let resultSet = new Array();
            if (request.searchMode === "regular") {
                debug("query index...");
                resultSet = yield this.index.query(comparator, 5000);
            }
            else {
                resultSet = yield this.index.linearQuery(comparator, 5000);
            }
            this.sorter.sort(resultSet);
            return resultSet;
        });
    }
}
exports.default = ImageFinder;
