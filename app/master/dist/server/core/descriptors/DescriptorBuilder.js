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
// tslint:disable:align
const TextUtil_1 = require("../common/TextUtil");
const Vector_1 = require("../common/Vector");
const ImageDTO_1 = require("../dto/ImageDTO");
const EventHub_1 = require("../EventHub");
const HSVHistogram_1 = require("../histogram/hsv/HSVHistogram");
const ImageTagger_1 = require("../image-tagger/ImageTagger");
const Settings_1 = require("../Settings");
const TextSimilarity_1 = require("../text-similarity/TextSimilarity");
const TextTranslator_1 = require("../text-translator/TextTranslator");
const Descriptors_1 = require("./Descriptors");
exports.Descriptor = Descriptors_1.Descriptor;
exports.ImageDescriptor = Descriptors_1.ImageDescriptor;
const Colr = require("colr");
const Debug = require("debug");
const Jimp = require("jimp");
const shajs = require("sha.js");
const hexToBinary = require("hex-to-binary");
const debug = Debug("ImageDescriptorBuilder");
const config = Settings_1.default.global();
/** Builder with static async functions for building descriptors */
class DescriptorBuilder {
    /** Create image descriptors asynchronously
    * @param dtos Basis for building image descriptors
    * @return Set of image descriptors
    */
    static createMany(dtos) {
        return __awaiter(this, void 0, void 0, function* () {
            const descriptors = new Array();
            debug("creating descriptors...");
            for (const dto of dtos) {
                try {
                    const descriptor = yield DescriptorBuilder.create(dto);
                    if (descriptor) {
                        descriptors.push(descriptor);
                    }
                }
                catch (e) {
                    console.error(e);
                    continue;
                }
            }
            return descriptors;
        });
    }
    /** Create request descriptor asynchronously from search query
    * @param colors Colors which user have selected
    * @param words Words from user text input
    * @return Descriptor
    */
    static createFromQuery(colors, words) {
        return __awaiter(this, void 0, void 0, function* () {
            const descriptor = new Descriptors_1.ImageDescriptor();
            const dto = new ImageDTO_1.default();
            let text = TextUtil_1.default.truncate(TextUtil_1.default.cleanTextFromHtml(words.join()), DescriptorBuilder.MAX_TEXT_LENGTH);
            let translated = false;
            if (DescriptorBuilder.textTranslator.isEnabled() && (text.length > 1)) {
                try {
                    text = yield DescriptorBuilder.textTranslator.translate(text);
                    translated = true;
                }
                catch (e) {
                    console.error(e);
                    EventHub_1.default.emit("translation-failed");
                }
            }
            const setOfWords = translated ? TextUtil_1.default.normalizedEnglishKeyWords(text) : [];
            debug(`set of user words: ${setOfWords}`);
            descriptor.mhSignature = DescriptorBuilder.textSimilarity.minHashSignature(setOfWords) || new Vector_1.default();
            descriptor.textEmbedding = translated ?
                yield DescriptorBuilder.textSimilarity.textEmbedding(setOfWords) : new Vector_1.default();
            const histogram = DescriptorBuilder.histogramFactory.createHistogram();
            for (const color of colors) {
                try {
                    for (let k = 0; k < color.weight; k++) {
                        const col = Colr.fromHslObject(color).toHsvObject();
                        histogram.addColor(col);
                    }
                }
                catch (e) {
                    console.error(e);
                    return null;
                }
            }
            histogram.done();
            descriptor.histogram = new Vector_1.default(histogram.toArray());
            return descriptor;
        });
    }
    /** Create image descriptor asynchronously
    * @param dto Basis for building image descriptor
    * @return Image descriptor
    */
    static create(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const descriptor = new Descriptors_1.ImageDescriptor();
            let autotags = [];
            debug("create descriptor...");
            const url = dto.source === "local" ? `${config.imgsPath}/${dto.url}` : dto.url;
            try {
                yield DescriptorBuilder.createImageHistogram(url, dto, descriptor);
            }
            catch (e) {
                console.error(e);
                return null;
            }
            if (DescriptorBuilder.imageTagger.isEnabled()) {
                try {
                    switch (dto.source) {
                        case "local":
                            autotags = (dto.base64 && dto.base64.length) > 0 ?
                                yield DescriptorBuilder.imageTagger.tagByBase64(dto.base64) : [];
                            break;
                        default:
                            autotags = yield DescriptorBuilder.imageTagger.tagByPublicURL(url);
                            break;
                    }
                }
                catch (e) {
                    autotags = [];
                    console.error(e);
                    EventHub_1.default.emit("tagging-failed");
                }
            }
            debug(`auto-tags: ${autotags}`);
            descriptor.autotags = Array.from(autotags);
            if (descriptor.autotags.length > DescriptorBuilder.MAX_AUTOTAGS) {
                descriptor.autotags.length = DescriptorBuilder.MAX_AUTOTAGS;
            }
            let text = TextUtil_1.default.truncate(dto.tags + " " + dto.title, DescriptorBuilder.MAX_TEXT_LENGTH);
            let translated = false;
            if (DescriptorBuilder.textTranslator.isEnabled()) {
                try {
                    text = yield DescriptorBuilder.textTranslator.translate(text);
                    translated = true;
                }
                catch (e) {
                    console.error(e);
                    EventHub_1.default.emit("translation-failed");
                }
            }
            let setOfWords = translated ? TextUtil_1.default.normalizedEnglishKeyWords(text) : [];
            setOfWords = setOfWords.filter((word) => (word.length >= DescriptorBuilder.MIN_WORD_LENGTH) &&
                (word.length <= DescriptorBuilder.MAX_WORD_LENGTH));
            autotags = TextUtil_1.default.stemmEnglishWords(autotags);
            const fullTags = TextUtil_1.default.uniqSet(autotags.concat(setOfWords));
            debug(`full tags: ${fullTags}`);
            let textEmbedding = new Vector_1.default();
            let mhSignature = new Vector_1.default();
            try {
                if (translated) {
                    mhSignature = yield DescriptorBuilder.textSimilarity.minHashSignature(fullTags);
                    textEmbedding = yield DescriptorBuilder.textSimilarity.textEmbedding(fullTags);
                }
                else if (autotags && autotags.length > 0) {
                    mhSignature = yield DescriptorBuilder.textSimilarity.minHashSignature(autotags);
                    textEmbedding = yield DescriptorBuilder.textSimilarity.textEmbedding(autotags);
                }
            }
            catch (e) {
                console.log(e);
            }
            descriptor.mhSignature = mhSignature || new Vector_1.default();
            descriptor.textEmbedding = textEmbedding || new Vector_1.default();
            descriptor.originId = dto.id;
            descriptor.source = dto.source;
            descriptor.previewURL = dto.previewURL;
            descriptor.originalURL = dto.originalURL;
            descriptor.url = dto.url;
            descriptor.owner = TextUtil_1.default.truncate(TextUtil_1.default.clean(dto.owner), DescriptorBuilder.MAX_OWNER_LENGTH);
            descriptor.title = TextUtil_1.default.truncate(TextUtil_1.default.clean(dto.title), DescriptorBuilder.MAX_TITLE_LENGTH);
            descriptor.license = dto.license;
            return descriptor;
        });
    }
    /**
    * Create image histogram and id
    */
    static createImageHistogram(url, dto, descriptor) {
        return __awaiter(this, void 0, void 0, function* () {
            const histogram = DescriptorBuilder.histogramFactory.createHistogram();
            debug("creating histogram...");
            return Jimp.read(url).then((image) => {
                debug(`original size: ${image.bitmap.width} X ${image.bitmap.height}`);
                if (image.bitmap.width > DescriptorBuilder.MAX_IMAGE_WIDTH) {
                    image.resize(DescriptorBuilder.MAX_IMAGE_WIDTH, Jimp.AUTO);
                }
                if (image.bitmap.height > DescriptorBuilder.MAX_IMAGE_HEIGHT) {
                    image.resize(Jimp.AUTO, DescriptorBuilder.MAX_IMAGE_HEIGHT);
                }
                image.blur(2);
                debug(`size for histogram: ${image.bitmap.width} X ${image.bitmap.height}`);
                debug("read...");
                image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
                    const rgbColor = { r: image.bitmap.data[idx + 0], g: image.bitmap.data[idx + 1],
                        b: image.bitmap.data[idx + 2] };
                    const color = Colr.fromRgbObject(rgbColor).toHsvObject();
                    histogram.addColor(color);
                });
                histogram.done();
                descriptor.histogram = new Vector_1.default(histogram.toArray());
                const base64 = image.bitmap.data.toString("base64");
                const signature = shajs("sha1").update(base64).digest("hex");
                const bin = hexToBinary(signature);
                descriptor.id = Number.parseInt(bin.substr(0, 53), 2);
                debug(`descriptor id: ${descriptor.id}`);
            });
        });
    }
}
DescriptorBuilder.MAX_TEXT_LENGTH = 10000;
DescriptorBuilder.MAX_WORD_LENGTH = 15;
DescriptorBuilder.MIN_WORD_LENGTH = 1;
DescriptorBuilder.MAX_TITLE_LENGTH = 50;
DescriptorBuilder.MAX_OWNER_LENGTH = 30;
DescriptorBuilder.MAX_AUTOTAGS = 30;
DescriptorBuilder.MAX_IMAGE_WIDTH = 150;
DescriptorBuilder.MAX_IMAGE_HEIGHT = 150;
DescriptorBuilder.textTranslator = new TextTranslator_1.default(Settings_1.default.textTranslator());
DescriptorBuilder.imageTagger = new ImageTagger_1.default(Settings_1.default.imageTagger());
DescriptorBuilder.textSimilarity = new TextSimilarity_1.default(Settings_1.default.textSimilarity());
DescriptorBuilder.histogramFactory = new HSVHistogram_1.default();
exports.DescriptorBuilder = DescriptorBuilder;
