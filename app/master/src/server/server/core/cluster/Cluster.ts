import {DAOFactory, ImagesDAO} from "../db-access/DAOFactory";
import {ImageDescriptor} from "../descriptors/Descriptors";
import ResultDTO from "../dto/ResultDTO";
import {Index} from "../index/Index";
import SearchRequest from "../SearchRequest";
import Settings from "../Settings";
import SlaveNode from "./SlaveNode";
import Debug = require("debug");
import flatten = require("arr-flatten");
const debug = Debug("Cluster");
const config = Settings.global();

/** Class with static methods to find, delete and save images in the Cluster */
export default class Cluster {

    private static imagesDao: ImagesDAO = DAOFactory.getImagesDAO();
    private static masterSaveLimit: number = config.saveLimit;
    private static masterNodeId: number = config.id;
    private static nodes: SlaveNode[] = config.nodes.map((conf) => {
        return new SlaveNode(conf.url, conf.secret, conf.id, conf.timeout);
    });

    public static nodesCount(): number {
        return Cluster.nodes.length;
    }

    public static getSlaveNode(id: number): SlaveNode {
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
    public static async findSimilarImages(request: SearchRequest): Promise<ResultDTO[][]> {
        let results = new Array<ResultDTO[]>(new Array<ResultDTO>());
        try {
            results = await Promise.all(this.nodes.map((node: SlaveNode) => {
                return node.findImages(request);
            }));
        } catch (e) {
            console.error(e);
        }
        return results && results.length ? results : new Array<ResultDTO[]>(new Array<ResultDTO>());
    }

    /** Delete descriptor from destributed database globally
    * @param id Image id
    * @return Results from several slave nodes
    */
    public static async deleteDescriptor(id: number): Promise<void> {
        Cluster.imagesDao.delete(id);
        Promise.all(this.nodes.map((node: SlaveNode) => {
            return node.deleteDescriptor(id);
        }));
    }

    /** Save image descriptors in database and on specific node in cluster
    * @param descriptors Image descriptors
    * @return Successfully saved image descriptors
    */
    public static async saveDescriptors(descriptors: ImageDescriptor[]): Promise<ImageDescriptor[]> {
        let saved = new Array<ImageDescriptor>();
        const ready = await Cluster.readyForSaving();
        const readyNodeIds = ready.filter((elem) => !!elem.ready).map((e) => e.id);
        debug(readyNodeIds);
        if (readyNodeIds.length > 0 && descriptors.length > 0) {
            const rand =  Math.round(Math.random() * (readyNodeIds.length - 1));
            const nodeId = readyNodeIds[rand];
            descriptors.forEach((desc) => desc.node = nodeId);
            saved = await Cluster.imagesDao.saveMany(descriptors);
            if (nodeId === this.masterNodeId) {
                debug(`saved on master: ${saved.length} images`);
            } else {
                await Cluster.notifySaveOnSlaveNode(nodeId, saved);
                debug(`saved on node ${nodeId}: ${saved.length} images`);
                saved = [];
            }
        }
        return saved;
    }

    /** Check master and slave nodes if they are ready for saving of new image descriptors
    * @param descriptors Image descriptors
    * @return Object with ready-states for each node in cluster
    */
    public static async readyForSaving(): Promise<Array<{id: number, ready: boolean}>> {
        let nodesReady = new Array<{id: number, ready: boolean}>();
        const nodeReadyResponses = Cluster.nodes.map((node) =>
        node.spaceAvailable().then((ready: boolean) => ({id: node.getId(), ready})));
        nodeReadyResponses.push(Cluster.imagesDao.countForNode()
        .then((amount) => ({id: Cluster.masterNodeId, ready: amount < Cluster.masterSaveLimit})));
        try {
            const result = await Promise.all(nodeReadyResponses);
            nodesReady = flatten(result);
        } catch (e) {
            console.error(e);
            nodesReady = [];
        }
        return nodesReady;
    }

    /** Send descriptors to specific slave node for indexing
    * @param id Id of slave node
    * @param descriptors Array of image descriptors
    */
    private static async notifySaveOnSlaveNode(id: number, descriptors: ImageDescriptor[]): Promise<void> {
        const node = await this.getSlaveNode(id);
        if (node instanceof SlaveNode) {
            try {
                debug("saving...");
                await node.saveDescriptors(descriptors);
            } catch (e) {
                console.error(e);
            }
        }
    }

    private constructor() {}
}
