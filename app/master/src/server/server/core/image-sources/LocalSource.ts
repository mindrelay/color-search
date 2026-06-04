// tslint:disable:no-bitwise
import TextUtil from "../common/TextUtil";
import ImageDTO from "../dto/ImageDTO";
import Debug = require("debug");
import path = require("path");
import fs = require("fs");
import md5 = require("md5");
import ImageSource from "./ImageSource";
const debug = Debug("LocalSource");

export default class LocalSource extends ImageSource {

    private sourceName: string;
    private cache: string[];
    private enabled: boolean;
    private path: string;
    private step: number;
    private imgsPath: string;
    private exts: string[];

    constructor(config: {enabled: boolean, step: number, path: string, publicPath: string}) {
        super();
        this.sourceName = "local";
        this.enabled = config.enabled === true;
        this.step = typeof config.step === "number" ? config.step : 5;
        this.path = config.path || "imgs";
        this.imgsPath = config.publicPath;
        this.exts = [".jpg", ".jpeg", ".gif"];
    }

    protected async getData(): Promise<ImageDTO[]> {
        const resultSet = new Array<ImageDTO>();
        if (this.enabled) {
            let files = new Array<string>();
            try {
                files = fs.readdirSync(this.path);
            } catch (e) {
                console.error(e);
            }
            if (files && files.length > 0) {
                files = files.filter((file) => {
                    try {
                        fs.accessSync(this.path + "/" + file, fs.constants.R_OK | fs.constants.W_OK);
                        return fs.lstatSync(this.path + "/" + file).isFile();
                    }catch (e) {
                        return false;
                    }
                });
                try {
                    await this.getImagesData(files, resultSet);
                } catch (e) {
                    console.error(e);
                }
            }
        }
        return resultSet;
    }

    private async getImagesData(files: any[], resultSet: ImageDTO[]): Promise<void> {
        const currentFiles = files.slice(0, this.step);
        const titleReg = /.+(?=\..+)/i;
        for (const file of currentFiles){
            if (this.exts.includes(path.extname(file))) {
                const dto = new ImageDTO();
                const fileName = titleReg.exec(file)[0];
                const text = TextUtil.cleanTextFromHtml(fileName);
                dto.base64 = fs.readFileSync(this.path + "/" + file, {encoding: "base64"});
                dto.id = md5(dto.base64);
                dto.tags = text;
                dto.source = this.sourceName;
                dto.url = dto.id + path.extname(file);
                dto.previewURL = dto.url;
                dto.originalURL = dto.url;
                dto.owner = "unknown";
                dto.license = "unknown";
                dto.title = text;
                try {
                    debug("move file to folder...");
                    fs.renameSync(this.path + "/" + file, this.imgsPath + "/" + dto.url);
                }catch (e) {
                    console.error(e);
                    continue;
                }
                resultSet.push(dto);
            }
        }
    }
}
