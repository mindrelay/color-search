import * as express from "express";
import bodyParser = require("body-parser");
import Cluster from "./server/core/cluster/Cluster";
import SlaveNode from "./server/core/cluster/SlaveNode";
import ImageSaver from "./server/core/image-saver/ImageSaver";
import IndexLSH from "./server/core/index/IndexLSH";
import Settings from "./server/core/Settings";
import TextSimilarity from "./server/core/text-similarity/TextSimilarity";
import Router from "./server/routing/Router";
const config = Settings.global();
const app = express();

(async () => {
    const index = new IndexLSH(Settings.index());
    await index.load();
    await new TextSimilarity(Settings.textSimilarity()).load();
    new ImageSaver(index, Settings.imageSaver()).start();
    app.use(express.static(config.imgsPath));
    app.use(express.static("client/"));
    app.use(bodyParser.json({limit: "50mb"}));
    const router = new Router(app, index);
    app.listen(config.port, config.ip);
    console.log("server started...");
})();

module.exports = app ;
