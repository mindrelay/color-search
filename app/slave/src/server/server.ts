import bodyParser = require("body-parser");
import * as express from "express";
import md5 = require ("md5");
import IndexLSH from "./server/core/index/IndexLSH";
import Settings from "./server/core/Settings";
import Router from "./server/routing/Router";
const cors = require("cors");
const config = Settings.global();
const app = express() as any;

(async () => {
    const auth = md5(`${config.rpcPassword}`) as string;
    const index = new IndexLSH(Settings.index());
    await index.load();
    app.use(cors({origin: config.master}));
    app.use((req, res, next) => {
        req.headers.authorization === auth ? next() :
        res.status(401).send("Unauthorized access prohibited");
    });
    app.use(bodyParser.json({limit: "50mb"}));
    const router = new Router(app, index);
    app.listen(config.port, config.ip);
    console.log("server node started...");
})();
