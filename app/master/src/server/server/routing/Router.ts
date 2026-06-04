import {Index} from "../core/index/Index";
import Controller from "./../controllers/Controller";

/**
* App router provides JSON RPC API.
* Router receives user reqests and calls appropriate controller methods.
*/
export default class Router {

    private controller: Controller;

    constructor(app: any, index: Index) {
        this.controller = new Controller(index);
        app.post("/", (req, res) => {
            const method = req.body && req.body.method ? req.body.method : "";
            switch (method) {
                case "find": this.controller.find(req, res); break;
                case "login": this.controller.login(req, res); break;
                case "loginRequired": this.controller.isLoginRequired(req, res); break;
                case "checkImage": this.controller.inspectImageForFailure(req, res); break;
                default: this.controller.error(req, res); break;
            }
        });
    }
}
