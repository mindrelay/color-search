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
// tslint:disable:no-string-literal
// tslint:disable:prefer-for-of
const fs = require("fs");
const TextUtil_1 = require("../../common/TextUtil");
const ImageDTO_js_1 = require("../../dto/ImageDTO.js");
const ImageSource_1 = require("../ImageSource");
const Debug = require("debug");
const debug = Debug("FlickrSource");
const Flickr_1 = require("./flickr-api/Flickr");
const flickr = new Flickr_1.default("***");
class FlickrSource extends ImageSource_1.default {
    constructor(config) {
        super();
        this.enabled = config.enabled === true;
        const step = typeof config.step === "number" ? config.step : 5;
        this.wordLists = Array.isArray(config.wordLists) ? config.wordLists : [];
        this.wordListsPath = __dirname + "/" + "word-lists";
        this.randomization = typeof config.randomization === "number" ? config.randomization : 0.5;
        this.sourceName = "flickr";
        this.apiMethod = "";
        this.imgsReader = new FlickrPhotoReader();
        this.options = {
            extras: "tags,owner_name,license",
            license: "1,2,3,4,5,6,9,10,4",
            media: "photos",
            page: 20,
            per_page: step,
            text: "",
            privacy_filter: 1,
            safe_search: 1,
            content_type: 1
        };
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            let resultSet = new Array();
            if (this.enabled) {
                debug("flickr get image data...");
                this.setupFlickrSearch();
                console.warn("selected word: " + this.options.text);
                try {
                    const result = yield flickr.get(this.apiMethod, this.options);
                    if (result && result.stat === "ok") {
                        const imgs = this.imgsReader.read(result);
                        resultSet = imgs.map((elem) => {
                            const dto = new ImageDTO_js_1.default();
                            dto.id = elem.id;
                            dto.url = elem.url;
                            dto.previewURL = elem.smallURL;
                            dto.originalURL = "http://flickr.com/photo.gne?id=" + elem.id;
                            dto.tags = TextUtil_1.default.cleanTextFromHtml(elem.tags);
                            dto.source = this.sourceName;
                            dto.owner = elem.owner;
                            dto.license = elem.license;
                            dto.title = TextUtil_1.default.cleanTextFromHtml(elem.title);
                            return dto;
                        });
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
            return resultSet;
        });
    }
    setupFlickrSearch() {
        this.options.text = "";
        this.apiMethod = "photos.getRecent";
        this.options.page = Math.round(Math.random() * 1000);
        if (this.wordLists.length > 0 && Math.random() >= this.randomization) {
            const listNum = Math.round(Math.random() * (this.wordLists.length - 1));
            const list = this.wordLists[listNum];
            try {
                const content = fs.readFileSync(this.wordListsPath + "/" + list, "utf8");
                const words = content.split("\n");
                const wordNum = Math.round(Math.random() * (words.length - 1));
                this.options.text = words[wordNum].trim();
                this.apiMethod = "photos.search";
            }
            catch (e) {
                console.error(e);
            }
        }
    }
}
exports.default = FlickrSource;
class FlickrPhotoReader {
    read(data) {
        const images = [];
        if (data.stat === "ok") {
            const photos = data.photos.photo;
            for (let i = 0; i < photos.length; i++) {
                if (photos[i].ispublic) {
                    const imgData = this.getImageData(photos[i]);
                    images.push(imgData);
                }
            }
        }
        else {
            console.error(data.message + ". Error code: " + data.code);
        }
        return images;
    }
    getImageData(photo) {
        const img = {};
        img.title = photo.title;
        img.tags = photo.tags;
        img.id = photo.id;
        const format = ".jpg";
        const url = "https://farm" + photo.farm + ".staticflickr.com/" +
            photo.server + "/" + photo.id + "_" + photo.secret;
        img.url = url + "_b" + format;
        img.smallURL = url + "_n" + format;
        img.owner = photo.ownername;
        img.license = photo.license;
        return img;
    }
}
