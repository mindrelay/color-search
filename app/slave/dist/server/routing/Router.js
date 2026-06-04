"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Settings_1 = require("../core/Settings");
const Controller_1 = require("./../controllers/Controller");
const config = Settings_1.default.global();
/**
* App router provides JSON RPC API.
* Router receives user reqests and calls appropriate controller methods.
*/
class Router {
    constructor(app, index) {
        this.controller = new Controller_1.default(index);
        app.post("/", (req, res) => {
            const method = req.body && req.body.method ? req.body.method : "";
            switch (method) {
                case "findImages":
                    this.controller.findImages(req, res);
                    break;
                case "saveDescriptors":
                    this.controller.saveDescriptors(req, res);
                    break;
                case "spaceAvailable":
                    this.controller.spaceAvailable(req, res);
                    break;
                case "deleteDescriptor":
                    this.controller.deleteDescriptor(req, res);
                    break;
                default:
                    this.controller.error(req, res);
                    break;
            }
        });
    }
}
exports.default = Router;
