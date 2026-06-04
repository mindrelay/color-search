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
const Settings_1 = require("../Settings");
const SlaveNode_1 = require("./SlaveNode");
const Debug = require("debug");
const flatten = require("arr-flatten");
const debug = Debug("Cluster");
const config = Settings_1.default.global();
/** Class with static methods to find, delete and save images in the Cluster */
class Cluster {
    constructor() { }
    static nodesCount() {
        return Cluster.nodes.length;
    }
    static getSlaveNode(id) {
        for (let i = 0, j = Cluster.nodes.length; i < j; i++) {
            if (Cluster.nodes[i].getId() === id) {
                return Cluster.nodes[i];
            }
        }
    }
    /** Find similar images on slave nodes
    * @param request Search request object with search settings
    * @return Results from several slave nodes
    */
    static findSimilarImages(request) {
        return __awaiter(this, void 0, void 0, function* () {
            let results = new Array(new Array());
            try {
                results = yield Promise.all(this.nodes.map((node) => {
                    return node.findImages(request);
                }));
            }
            catch (e) {
                console.error(e);
            }
            return results && results.length ? results : new Array(new Array());
        });
    }
    /** Delete descriptor from destributed database globally
    * @param id Image id
    * @return Results from several slave nodes
    */
    static deleteDescriptor(id) {
        return __awaiter(this, void 0, void 0, function* () {
            Cluster.imagesDao.delete(id);
            Promise.all(this.nodes.map((node) => {
                return node.deleteDescriptor(id);
            }));
        });
    }
    /** Save image descriptors in database and on specific node in cluster
    * @param descriptors Image descriptors
    * @return Successfully saved image descriptors
    */
    static saveDescriptors(descriptors) {
        return __awaiter(this, void 0, void 0, function* () {
            let saved = new Array();
            const ready = yield Cluster.readyForSaving();
            const readyNodeIds = ready.filter((elem) => !!elem.ready).map((e) => e.id);
            debug(readyNodeIds);
            if (readyNodeIds.length > 0 && descriptors.length > 0) {
                const rand = Math.round(Math.random() * (readyNodeIds.length - 1));
                const nodeId = readyNodeIds[rand];
                descriptors.forEach((desc) => desc.node = nodeId);
                saved = yield Cluster.imagesDao.saveMany(descriptors);
                if (nodeId === this.masterNodeId) {
                    debug(`saved on master: ${saved.length} images`);
                }
                else {
                    yield Cluster.notifySaveOnSlaveNode(nodeId, saved);
                    debug(`saved on node ${nodeId}: ${saved.length} images`);
                    saved = [];
                }
            }
            return saved;
        });
    }
    /** Check master and slave nodes if they are ready for saving of new image descriptors
    * @param descriptors Image descriptors
    * @return Object with ready-states for each node in cluster
    */
    static readyForSaving() {
        return __awaiter(this, void 0, void 0, function* () {
            let nodesReady = new Array();
            const nodeReadyResponses = Cluster.nodes.map((node) => node.spaceAvailable().then((ready) => ({ id: node.getId(), ready })));
            nodeReadyResponses.push(Cluster.imagesDao.countForNode()
                .then((amount) => ({ id: Cluster.masterNodeId, ready: amount < Cluster.masterSaveLimit })));
            try {
                const result = yield Promise.all(nodeReadyResponses);
                nodesReady = flatten(result);
            }
            catch (e) {
                console.error(e);
                nodesReady = [];
            }
            return nodesReady;
        });
    }
    /** Send descriptors to specific slave node for indexing
    * @param id Id of slave node
    * @param descriptors Array of image descriptors
    */
    static notifySaveOnSlaveNode(id, descriptors) {
        return __awaiter(this, void 0, void 0, function* () {
            const node = yield this.getSlaveNode(id);
            if (node instanceof SlaveNode_1.default) {
                try {
                    debug("saving...");
                    yield node.saveDescriptors(descriptors);
                }
                catch (e) {
                    console.error(e);
                }
            }
        });
    }
}
Cluster.imagesDao = DAOFactory_1.DAOFactory.getImagesDAO();
Cluster.masterSaveLimit = config.saveLimit;
Cluster.masterNodeId = config.id;
Cluster.nodes = config.nodes.map((conf) => {
    return new SlaveNode_1.default(conf.url, conf.secret, conf.id, conf.timeout);
});
exports.default = Cluster;
