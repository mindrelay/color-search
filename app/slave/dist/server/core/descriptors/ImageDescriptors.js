"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DAOFactory_1 = require("../db-access/DAOFactory");
class ImageDescriptors {
    constructor(index, saveLimit) {
        this.dao = DAOFactory_1.DAOFactory.getImagesNodeDAO();
        this.index = index;
        this.saveLimit = saveLimit;
    }
    saveMany(descriptors) {
        return __awaiter(this, void 0, void 0, function* () {
            this.index.indexMany(descriptors);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.index.remove(id);
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.dao.countForNode();
        });
    }
    maxReached() {
        return __awaiter(this, void 0, void 0, function* () {
            let count = this.saveLimit;
            try {
                count = yield this.count();
            }
            catch (e) {
                console.error(e);
            }
            return count >= this.saveLimit;
        });
    }
}
exports.default = ImageDescriptors;
