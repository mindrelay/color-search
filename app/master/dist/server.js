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
const express = require("express");
const bodyParser = require("body-parser");
const ImageSaver_1 = require("./server/core/image-saver/ImageSaver");
const IndexLSH_1 = require("./server/core/index/IndexLSH");
const Settings_1 = require("./server/core/Settings");
const TextSimilarity_1 = require("./server/core/text-similarity/TextSimilarity");
const Router_1 = require("./server/routing/Router");
const config = Settings_1.default.global();
const app = express();
(() => __awaiter(this, void 0, void 0, function* () {
    const index = new IndexLSH_1.default(Settings_1.default.index());
    yield index.load();
    yield new TextSimilarity_1.default(Settings_1.default.textSimilarity()).load();
    new ImageSaver_1.default(index, Settings_1.default.imageSaver()).start();
    app.use(express.static(config.imgsPath));
    app.use(express.static("client/"));
    app.use(bodyParser.json({ limit: "50mb" }));
    const router = new Router_1.default(app, index);
    app.listen(config.port, config.ip);
    console.log("server started...");
}))();
module.exports = app;
