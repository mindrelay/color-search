import Settings from "../Settings";
import ImagesNodeDAOCouchbase from "./couchbase/ImagesNodeDAOCouchbase";
import {ImagesNodeDAO} from "./DAOInterfaces";

class DAOFactory {

    private constructor() {}

    public static getImagesNodeDAO(): ImagesNodeDAO {
        const database = Settings.global().database;
        let imagesDAO: ImagesNodeDAO;
        switch (database) {
            case "couchbase": imagesDAO = new ImagesNodeDAOCouchbase(); break;
        }
        return imagesDAO;
    }
}

export {DAOFactory, ImagesNodeDAO};
