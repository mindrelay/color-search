"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const XRegExp = require("xregexp");
const cleanTextUtils = require("clean-text-utils");
const keywordExtractor = require("keyword-extractor");
const sanitizeHtml = require("sanitize-html");
const stemmer = require("node-snowball");
/**
* Text utility class
*/
class TextUtil {
    constructor() { }
    /**
    * Get set of stemmed key english words. Removes stop words.
    * @param param Text or set of english words
    * @returns Set of stemmed lower cased english words
    */
    static normalizedEnglishKeyWords(param) {
        const text = Array.isArray(param) ? this.tokenizeEnglishText(param.join(" ")).join(" ") :
            this.tokenizeEnglishText(param).join(" ");
        let words = new Array();
        const opts = {
            language: "english",
            remove_digits: true,
            remove_duplicates: false,
            return_changed_case: true,
        };
        words = keywordExtractor.extract(text.toLowerCase(), opts);
        words = stemmer.stemword(words, "english");
        words = TextUtil.uniqSet(words);
        return words;
    }
    /**
    * Creates set with uniq words from text
    * @param text Text that will be tokenized
    * @returns Set of uniq lower cased words
    */
    static setOfUniqWords(text) {
        const words = this.tokenizeText(text.toLowerCase());
        return TextUtil.uniqSet(words);
    }
    /**
    * Stemm english words
    * @param words Set or bag of english words
    * @returns Set or bag of stemmed english words in lower case
    */
    static stemmEnglishWords(words) {
        const lowerCaseWords = words.map((word) => word.toLowerCase());
        return stemmer.stemword(lowerCaseWords, "english");
    }
    /**
    * Clean text from HTML entities
    */
    static cleanTextFromHtml(text) {
        return sanitizeHtml(text, {
            allowedAttributes: [],
            allowedTags: [],
        });
    }
    /**
    * Creates set with uniq string elements
    * @param bag Bag/Multiset
    * @returns Set with uniq string elements
    */
    static uniqSet(bag) {
        return [...new Set(bag)];
    }
    /**
    * Tokenize text
    * @param text Text that will be tokenized
    * @returns Set/bag of words
    */
    static tokenizeText(text) {
        return XRegExp.match(text, TextUtil.wordsRegex);
    }
    /**
    * Tokenize text
    * @param text English text that will be tokenized
    * @returns Set/bag of words
    */
    static tokenizeEnglishText(text) {
        return XRegExp.match(text, TextUtil.englishWordsRegex);
    }
    /**
    * Truncate text length
    * @param text Text
    * @param length Max. text length
    * @returns Truncated text
    */
    static truncate(text, length) {
        return text.length > length ? text.substr(0, length) + "..." : text;
    }
    /**
    * Clean text from special characters, emojis
    * @param text Text
    * @returns Clean text
    */
    static clean(text) {
        const txt = cleanTextUtils.strip.emoji(text);
        return txt.replace(TextUtil.cleanRegex, "").trim();
    }
}
TextUtil.wordsRegex = XRegExp("\\pL+(?:[-'’]?\\pL+)*", "gi");
TextUtil.englishWordsRegex = XRegExp("\\b[a-zA-Z]+(?:[-'’]?[a-zA-Z]+)+\\b", "gi");
TextUtil.cleanRegex = /['"\/\\{}\[\]\x00-\x1F\x7F-\x9F]/g;
exports.default = TextUtil;
