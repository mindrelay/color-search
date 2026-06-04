import XRegExp = require("xregexp");
import cleanTextUtils = require("clean-text-utils");
import keywordExtractor = require("keyword-extractor");
import sanitizeHtml = require("sanitize-html");
import stemmer = require("node-snowball");

/**
* Text utility class
*/
export default class TextUtil {

    private constructor() {}

    /**
    * Get set of stemmed key english words. Removes stop words.
    * @param param Text or set of english words
    * @returns Set of stemmed lower cased english words
    */
    public static normalizedEnglishKeyWords(param: string | string[]): string[] {
        const text = Array.isArray(param) ? this.tokenizeEnglishText(param.join(" ")).join(" ") :
        this.tokenizeEnglishText(param).join(" ");
        let words = new Array<string>();
        const opts = {
            language: "english",
            remove_digits: true,
            remove_duplicates: false,
            return_changed_case: true,
        };
        words = keywordExtractor.extract(text.toLowerCase(), opts);
        words = stemmer.stemword(words, "english");
        words  = TextUtil.uniqSet(words);
        return words;
    }

    /**
    * Creates set with uniq words from text
    * @param text Text that will be tokenized
    * @returns Set of uniq lower cased words
    */
    public static setOfUniqWords(text: string): string[] {
        const words = this.tokenizeText(text.toLowerCase());
        return TextUtil.uniqSet(words);
    }

    /**
    * Stemm english words
    * @param words Set or bag of english words
    * @returns Set or bag of stemmed english words in lower case
    */
    public static stemmEnglishWords(words: string[]): string[] {
        const lowerCaseWords: string[] = words.map((word) => word.toLowerCase());
        return stemmer.stemword(lowerCaseWords, "english");
    }

    /**
    * Clean text from HTML entities
    */
    public static cleanTextFromHtml(text: string): string {
        return sanitizeHtml(text, {
            allowedAttributes: [],
            allowedTags: [],
        }) as string;
    }

    /**
    * Creates set with uniq string elements
    * @param bag Bag/Multiset
    * @returns Set with uniq string elements
    */
    public static uniqSet(bag: string[]): string[] {
        return [...new Set(bag)];
    }

    /**
    * Tokenize text
    * @param text Text that will be tokenized
    * @returns Set/bag of words
    */
    public static tokenizeText(text: string): string[] {
       return XRegExp.match(text, TextUtil.wordsRegex);
    }

    /**
    * Tokenize text
    * @param text English text that will be tokenized
    * @returns Set/bag of words
    */
    public static tokenizeEnglishText(text: string): string[] {
        return XRegExp.match(text, TextUtil.englishWordsRegex);
    }

    /**
    * Truncate text length
    * @param text Text
    * @param length Max. text length
    * @returns Truncated text
    */
    public static truncate(text: string, length: number): string {
        return text.length > length ? text.substr(0, length) + "..." :  text;
    }

    /**
    * Clean text from special characters, emojis
    * @param text Text
    * @returns Clean text
    */
    public static clean(text: string) {
        const txt = cleanTextUtils.strip.emoji(text);
        return txt.replace(TextUtil.cleanRegex, "").trim();
    }

    private static wordsRegex = XRegExp("\\pL+(?:[-'’]?\\pL+)*", "gi");
    private static englishWordsRegex = XRegExp("\\b[a-zA-Z]+(?:[-'’]?[a-zA-Z]+)+\\b", "gi");
    private static cleanRegex = /['"\/\\{}\[\]\x00-\x1F\x7F-\x9F]/g;
}
