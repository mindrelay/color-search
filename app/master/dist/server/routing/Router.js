"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Controller_1 = require("./../controllers/Controller");
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
                case "find":
                    this.controller.find(req, res);
                    break;
                case "login":
                    this.controller.login(req, res);
                    break;
                case "loginRequired":
                    this.controller.isLoginRequired(req, res);
                    break;
                case "checkImage":
                    this.controller.inspectImageForFailure(req, res);
                    break;
                default:
                    this.controller.error(req, res);
                    break;
            }
        });
    }
}
exports.default = Router;
