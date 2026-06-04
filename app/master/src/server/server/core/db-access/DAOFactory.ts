import Settings from "../Settings";
import ImagesDAOCouchbase from "./couchbase/ImagesDAOCouchbase";
import VectorSemanticsDAOCouchbase from "./couchbase/VectorSemanticsDAOCouchbase";
import {ImagesDAO, VectorSemanticsDAO} from "./DAOInterfaces";
import ImagesDAOMongo from "./mongo/ImagesDAOMongo";
import VectorSemanticsDAOMongo from "./mongo/VectorSemanticsDAOMongo";

class DAOFactory {

    private constructor() {}

    public static getImagesDAO(): ImagesDAO {
        const database = Settings.global().database;
        let imagesDAO: ImagesDAO;
        switch (database) {
            case "mongodb": imagesDAO = new ImagesDAOMongo(); break;
            case "couchbase": imagesDAO = new ImagesDAOCouchbase(); break;
        }
        return imagesDAO;
    }

    public static getVectorSemanticsDAO(): VectorSemanticsDAO {
        const database = Settings.global().database;
        let vectorSemanticsDAO: VectorSemanticsDAO;
        switch (database) {
            case "mongodb": vectorSemanticsDAO = new VectorSemanticsDAOMongo(); break;
            case "couchbase": vectorSemanticsDAO = new VectorSemanticsDAOCouchbase(); break;
        }
        return vectorSemanticsDAO;
    }
}

export {DAOFactory, ImagesDAO, VectorSemanticsDAO};
