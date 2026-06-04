"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Settings_1 = require("../Settings");
const ImagesNodeDAOCouchbase_1 = require("./couchbase/ImagesNodeDAOCouchbase");
class DAOFactory {
    constructor() { }
    static getImagesNodeDAO() {
        const database = Settings_1.default.global().database;
        let imagesDAO;
        switch (database) {
            case "couchbase":
                imagesDAO = new ImagesNodeDAOCouchbase_1.default();
                break;
        }
        return imagesDAO;
    }
}
exports.DAOFactory = DAOFactory;
