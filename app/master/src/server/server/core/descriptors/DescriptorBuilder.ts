// tslint:disable:align
import TextUtil from "../common/TextUtil";
import Vector from "../common/Vector";
import ImageDTO from "../dto/ImageDTO";
import EventHub from "../EventHub";
import {Histogram, HistogramFactory} from "../histogram/Histogram";
import HSVHistogramFactory from "../histogram/hsv/HSVHistogram";
import ImageTagger from "../image-tagger/ImageTagger";
import Settings from "../Settings";
import TextSimilarity from "../text-similarity/TextSimilarity";
import TextTranslator from "../text-translator/TextTranslator";
import {Descriptor, ImageDescriptor} from "./Descriptors";
import Colr = require("colr");
import Debug = require("debug");
const Jimp = require("jimp");
const shajs = require("sha.js");
const hexToBinary = require("hex-to-binary");
const debug = Debug("ImageDescriptorBuilder");
const config = Settings.global();

/** Builder with static async functions for building descriptors */
class DescriptorBuilder {

    /** Create image descriptors asynchronously
    * @param dtos Basis for building image descriptors
    * @return Set of image descriptors
    */
    public static async createMany(dtos: ImageDTO[]): Promise<ImageDescriptor[]> {
        const descriptors = new Array<ImageDescriptor>();
        debug("creating descriptors...");
        for (const dto of dtos){
            try {
                const descriptor = await DescriptorBuilder.create(dto);
                if (descriptor) {
                    descriptors.push(descriptor);
                }
            }catch (e) {
                console.error(e);
                continue;
            }
        }
        return descriptors;
    }

    /** Create request descriptor asynchronously from search query
    * @param colors Colors which user have selected
    * @param words Words from user text input
    * @return Descriptor
    */
    public static async createFromQuery(colors: any[], words: string[]): Promise<Descriptor> {
        const descriptor = new ImageDescriptor();
        const dto = new ImageDTO();
        let text = TextUtil.truncate(TextUtil.cleanTextFromHtml(words.join()), DescriptorBuilder.MAX_TEXT_LENGTH);
        let translated = false;
        if (DescriptorBuilder.textTranslator.isEnabled() && (text.length > 1)) {
            try {
                text = await DescriptorBuilder.textTranslator.translate(text);
                translated = true;
            } catch (e) {
                console.error(e);
                EventHub.emit("translation-failed");
            }
        }
        const setOfWords = translated ? TextUtil.normalizedEnglishKeyWords(text) : [];
        debug(`set of user words: ${setOfWords}`);
        descriptor.mhSignature = DescriptorBuilder.textSimilarity.minHashSignature(setOfWords) || new Vector();
        descriptor.textEmbedding = translated ?
        await DescriptorBuilder.textSimilarity.textEmbedding(setOfWords) : new Vector();
        const histogram: Histogram = DescriptorBuilder.histogramFactory.createHistogram();
        for (const color of colors){
            try {
                for (let k = 0; k < color.weight; k++) {
                    const col = Colr.fromHslObject(color).toHsvObject();
                    histogram.addColor(col);
                }
            }catch (e) {
                console.error(e);
                return null;
            }
        }
        histogram.done();
        descriptor.histogram = new Vector(histogram.toArray());
        return descriptor;
    }

    /** Create image descriptor asynchronously
    * @param dto Basis for building image descriptor
    * @return Image descriptor
    */
    public static async create(dto: ImageDTO): Promise<ImageDescriptor> {
        const descriptor = new ImageDescriptor();
        let autotags: string[] = [];
        debug("create descriptor...");
        const url = dto.source === "local" ? `${config.imgsPath}/${ dto.url}` : dto.url;
        try {
            await DescriptorBuilder.createImageHistogram(url, dto, descriptor);
        }catch (e) {
            console.error(e);
            return null;
        }
        if (DescriptorBuilder.imageTagger.isEnabled()) {
            try {
                switch (dto.source) {
                    case "local":  autotags = (dto.base64 && dto.base64.length) > 0 ?
                    await DescriptorBuilder.imageTagger.tagByBase64(dto.base64) : []; break;
                    default: autotags = await DescriptorBuilder.imageTagger.tagByPublicURL(url); break;
                }
            } catch (e) {
                autotags = [];
                console.error(e);
                EventHub.emit("tagging-failed");
            }
        }
        debug(`auto-tags: ${autotags}`);
        descriptor.autotags = Array.from(autotags);
        if (descriptor.autotags.length > DescriptorBuilder.MAX_AUTOTAGS) {
            descriptor.autotags.length = DescriptorBuilder.MAX_AUTOTAGS;
        }
        let text = TextUtil.truncate(dto.tags + " " + dto.title, DescriptorBuilder.MAX_TEXT_LENGTH);
        let translated = false;
        if (DescriptorBuilder.textTranslator.isEnabled()) {
            try {
                text = await DescriptorBuilder.textTranslator.translate(text);
                translated = true;
            } catch (e) {
                console.error(e);
                EventHub.emit("translation-failed");
            }
        }
        let setOfWords = translated ? TextUtil.normalizedEnglishKeyWords(text) : [];
        setOfWords = setOfWords.filter((word) =>
        (word.length >= DescriptorBuilder.MIN_WORD_LENGTH) &&
        (word.length <= DescriptorBuilder.MAX_WORD_LENGTH));
        autotags = TextUtil.stemmEnglishWords(autotags);
        const fullTags = TextUtil.uniqSet(autotags.concat(setOfWords));
        debug(`full tags: ${fullTags}`);
        let textEmbedding = new Vector();
        let mhSignature = new Vector();
        try {
            if (translated) {
                mhSignature = await DescriptorBuilder.textSimilarity.minHashSignature(fullTags);
                textEmbedding = await DescriptorBuilder.textSimilarity.textEmbedding(fullTags);
            } else if (autotags && autotags.length > 0) {
                mhSignature = await DescriptorBuilder.textSimilarity.minHashSignature(autotags);
                textEmbedding = await DescriptorBuilder.textSimilarity.textEmbedding(autotags);
            }
        } catch (e) {
            console.log(e);
        }
        descriptor.mhSignature = mhSignature || new Vector();
        descriptor.textEmbedding = textEmbedding || new Vector();
        descriptor.originId = dto.id;
        descriptor.source = dto.source;
        descriptor.previewURL = dto.previewURL;
        descriptor.originalURL = dto.originalURL;
        descriptor.url = dto.url;
        descriptor.owner = TextUtil.truncate(TextUtil.clean(dto.owner), DescriptorBuilder.MAX_OWNER_LENGTH);
        descriptor.title = TextUtil.truncate(TextUtil.clean(dto.title), DescriptorBuilder.MAX_TITLE_LENGTH);
        descriptor.license = dto.license;
        return descriptor;
    }

    /**
    * Create image histogram and id
    */
    private static async createImageHistogram(url: string, dto: ImageDTO, descriptor: ImageDescriptor): Promise<void> {
        const histogram: Histogram = DescriptorBuilder.histogramFactory.createHistogram();
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
                const rgbColor = {r: image.bitmap.data[idx + 0], g: image.bitmap.data[idx + 1],
                                  b: image.bitmap.data[idx + 2]};
                const color = Colr.fromRgbObject(rgbColor).toHsvObject();
                histogram.addColor(color);
            });
            histogram.done();
            descriptor.histogram = new Vector(histogram.toArray());
            const base64 = image.bitmap.data.toString("base64");
            const signature = shajs("sha1").update(base64).digest("hex");
            const bin = hexToBinary(signature);
            descriptor.id = Number.parseInt(bin.substr(0, 53), 2);
            debug(`descriptor id: ${descriptor.id}`);
        });
    }

    private static MAX_TEXT_LENGTH = 10000;
    private static MAX_WORD_LENGTH = 15;
    private static MIN_WORD_LENGTH = 1;
    private static MAX_TITLE_LENGTH = 50;
    private static MAX_OWNER_LENGTH = 30;
    private static MAX_AUTOTAGS = 30;
    private static MAX_IMAGE_WIDTH = 150;
    private static MAX_IMAGE_HEIGHT = 150;
    private static textTranslator = new TextTranslator(Settings.textTranslator());
    private static imageTagger = new ImageTagger(Settings.imageTagger());
    private static textSimilarity = new TextSimilarity(Settings.textSimilarity());
    private static histogramFactory = new HSVHistogramFactory();
}

export {DescriptorBuilder, ImageDescriptor, Descriptor};
