"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Settings_1 = require("../Settings");
const serverURL = Settings_1.default.global().serverUrl;
class ImageURLResolver {
    static resolveURL(imageData, url) {
        switch (imageData.source) {
            case "local":
                url = serverURL + "/" + imageData.url;
                break;
        }
        return url;
    }
}
exports.default = ImageURLResolver;
