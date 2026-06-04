"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const XRegExp = require("xregexp");
const keywordExtractor = require("keyword-extractor");
const opts = {
    language: "english",
    remove_digits: false,
    remove_duplicates: false,
    return_changed_case: true,
};
class WordsFileReader {
    constructor() {
        this.wordsRegex = XRegExp("(?:\\pL|\\pN+(?:[,.]?\\pN)*)+(?:[-'’]?(?:\\pL|\\pN+(?:[,.]?\\pN)*)+)*", "gi");
    }
    read(path) {
        const text = fs.readFileSync(path, "utf8");
        return XRegExp.match(keywordExtractor.extract(text.toLowerCase(), opts), this.wordsRegex);
    }
    readFolder(path, maxWords) {
        let files = fs.readdirSync(path);
        files = files.filter((file) => {
            return fs.lstatSync(path + "/" + file).isFile();
        });
        let j = 0;
        return {
            nextText: () => {
                let words = [];
                for (let i = j; i < files.length; i++) {
                    words = words.concat(this.read(path + "/" + files[i]));
                    j++;
                    if (words.length >= maxWords) {
                        break;
                    }
                }
                return words;
            }
        };
    }
}
exports.default = WordsFileReader;
