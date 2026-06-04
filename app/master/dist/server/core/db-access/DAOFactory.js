"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Settings_1 = require("../Settings");
const ImagesDAOCouchbase_1 = require("./couchbase/ImagesDAOCouchbase");
const VectorSemanticsDAOCouchbase_1 = require("./couchbase/VectorSemanticsDAOCouchbase");
const ImagesDAOMongo_1 = require("./mongo/ImagesDAOMongo");
const VectorSemanticsDAOMongo_1 = require("./mongo/VectorSemanticsDAOMongo");
class DAOFactory {
    constructor() { }
    static getImagesDAO() {
        const database = Settings_1.default.global().database;
        let imagesDAO;
        switch (database) {
            case "mongodb":
                imagesDAO = new ImagesDAOMongo_1.default();
                break;
            case "couchbase":
                imagesDAO = new ImagesDAOCouchbase_1.default();
                break;
        }
        return imagesDAO;
    }
    static getVectorSemanticsDAO() {
        const database = Settings_1.default.global().database;
        let vectorSemanticsDAO;
        switch (database) {
            case "mongodb":
                vectorSemanticsDAO = new VectorSemanticsDAOMongo_1.default();
                break;
            case "couchbase":
                vectorSemanticsDAO = new VectorSemanticsDAOCouchbase_1.default();
                break;
        }
        return vectorSemanticsDAO;
    }
}
exports.DAOFactory = DAOFactory;
