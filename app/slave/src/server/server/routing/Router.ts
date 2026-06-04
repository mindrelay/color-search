import {Index} from "../core/index/Index";
import Settings from "../core/Settings";
import Controller from "./../controllers/Controller";
const config = Settings.global();

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
                case "findImages": this.controller.findImages(req, res); break;
                case "saveDescriptors": this.controller.saveDescriptors(req, res); break;
                case "spaceAvailable": this.controller.spaceAvailable(req, res); break;
                case "deleteDescriptor": this.controller.deleteDescriptor(req, res); break;
                default: this.controller.error(req, res); break;
            }
        });
    }
}
