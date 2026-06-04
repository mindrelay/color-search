// tslint:disable:no-string-literal
// tslint:disable:prefer-for-of
import fs = require("fs");
import TextUtil from "../../common/TextUtil";
import ImageDTO from "../../dto/ImageDTO.js";
import ImageSource from "../ImageSource";
import Debug = require("debug");
const debug = Debug("FlickrSource");
import Flickr from "./flickr-api/Flickr";
const flickr = new Flickr("***");

export default class FlickrSource extends ImageSource {

    private sourceName: string;
    private options: any;
    private imgsReader: FlickrPhotoReader;
    private enabled: boolean;
    private step: number;
    private wordLists: string[];
    private apiMethod: string;
    private wordListsPath: string;
    private randomization: number;

    constructor(config: {enabled: boolean, step: number,
                        wordLists: string[], randomization: number }) {
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
            license : "1,2,3,4,5,6,9,10,4",
            media: "photos",
            page : 20,
            per_page : step,
            text : "",
            privacy_filter: 1,
            safe_search: 1,
            content_type: 1
        };
    }

    protected async getData(): Promise<ImageDTO[]> {
        let resultSet = new Array<ImageDTO>();
        if (this.enabled) {
            debug("flickr get image data...");
            this.setupFlickrSearch();
            console.warn("selected word: " + this.options.text);
            try {
                const result = await flickr.get(this.apiMethod, this.options);
                if (result && result.stat === "ok") {
                    const imgs = this.imgsReader.read(result);
                    resultSet = imgs.map((elem) => {
                        const dto = new ImageDTO();
                        dto.id = elem.id;
                        dto.url = elem.url;
                        dto.previewURL = elem.smallURL;
                        dto.originalURL = "http://flickr.com/photo.gne?id=" + elem.id;
                        dto.tags = TextUtil.cleanTextFromHtml(elem.tags);
                        dto.source = this.sourceName;
                        dto.owner = elem.owner;
                        dto.license = elem.license;
                        dto.title = TextUtil.cleanTextFromHtml(elem.title);
                        return dto;
                    });
                }
            }catch (e) {
                console.error(e);
            }
        }
        return resultSet;
    }

    private setupFlickrSearch(): void {
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
            }catch (e) {
                console.error(e);
            }
        }
    }
}

class FlickrPhotoReader {
    public read(data: any): any[] {
        const images = [];
        if (data.stat === "ok") {
            const photos = data.photos.photo;
            for (let i = 0; i < photos.length; i++) {
                if (photos[i].ispublic) {
                    const imgData = this.getImageData(photos[i]);
                    images.push(imgData);
                }
            }
        }else {
            console.error(data.message + ". Error code: " + data.code);
        }
        return images;
    }

    private getImageData(photo): any {
        const img: {[k: string]: any} = {};
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
