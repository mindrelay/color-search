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
// tslint:disable:no-bitwise
const TextUtil_1 = require("../common/TextUtil");
const ImageDTO_1 = require("../dto/ImageDTO");
const Debug = require("debug");
const path = require("path");
const fs = require("fs");
const md5 = require("md5");
const ImageSource_1 = require("./ImageSource");
const debug = Debug("LocalSource");
class LocalSource extends ImageSource_1.default {
    constructor(config) {
        super();
        this.sourceName = "local";
        this.enabled = config.enabled === true;
        this.step = typeof config.step === "number" ? config.step : 5;
        this.path = config.path || "imgs";
        this.imgsPath = config.publicPath;
        this.exts = [".jpg", ".jpeg", ".gif"];
    }
    getData() {
        return __awaiter(this, void 0, void 0, function* () {
            const resultSet = new Array();
            if (this.enabled) {
                let files = new Array();
                try {
                    files = fs.readdirSync(this.path);
                }
                catch (e) {
                    console.error(e);
                }
                if (files && files.length > 0) {
                    files = files.filter((file) => {
                        try {
                            fs.accessSync(this.path + "/" + file, fs.constants.R_OK | fs.constants.W_OK);
                            return fs.lstatSync(this.path + "/" + file).isFile();
                        }
                        catch (e) {
                            return false;
                        }
                    });
                    try {
                        yield this.getImagesData(files, resultSet);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
            return resultSet;
        });
    }
    getImagesData(files, resultSet) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentFiles = files.slice(0, this.step);
            const titleReg = /.+(?=\..+)/i;
            for (const file of currentFiles) {
                if (this.exts.includes(path.extname(file))) {
                    const dto = new ImageDTO_1.default();
                    const fileName = titleReg.exec(file)[0];
                    const text = TextUtil_1.default.cleanTextFromHtml(fileName);
                    dto.base64 = fs.readFileSync(this.path + "/" + file, { encoding: "base64" });
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
                    }
                    catch (e) {
                        console.error(e);
                        continue;
                    }
                    resultSet.push(dto);
                }
            }
        });
    }
}
exports.default = LocalSource;
