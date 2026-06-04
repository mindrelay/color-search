import fs = require("fs");
import Path = require("path");
import XRegExp = require("xregexp");
import keywordExtractor = require("keyword-extractor");

const opts = {
    language: "english",
    remove_digits: false,
    remove_duplicates: false,
    return_changed_case: true,
};

export default class WordsFileReader {

    private wordsRegex: any;

    constructor() {
        this.wordsRegex = XRegExp("(?:\\pL|\\pN+(?:[,.]?\\pN)*)+(?:[-'’]?(?:\\pL|\\pN+(?:[,.]?\\pN)*)+)*", "gi");
    }

    public read(path: string): string[] {
        const text = fs.readFileSync(path, "utf8");
        return XRegExp.match(keywordExtractor.extract(text.toLowerCase(), opts), this.wordsRegex);
    }

    public readFolder(path: string, maxWords: number) {
        let files = fs.readdirSync(path);
        files = files.filter((file) => {
            return fs.lstatSync(path + "/" + file).isFile();
        });
        let j = 0;
        return {
            nextText: (): string[] => {
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
