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
const CircularList_1 = require("../common/CircularList");
/**
* Service executor provides circular execution of services
* If one service is corrupt or unavailable, the next
* service will be called
*/
class ServiceExecutor {
    /**
    * Create ServiceExecutor
    * @param attemptsLimit Maximum number of attempts for each service execution
    * @param timeout Timeout for service execution
    */
    constructor(attemptsLimit, timeout) {
        this.services = new CircularList_1.default();
        this.attemptsLimit = attemptsLimit;
        this.timeout = timeout;
    }
    addService(service) {
        this.services.add(service);
    }
    servicesCount() {
        return this.services.size();
    }
    hasServices() {
        return this.services.size() > 0;
    }
    /**
    * Asynchronous method for circular service execution
    * If the service is corrupt or unavailable (timeout), the next service
    * in circular list will be called
    * @param method Asynchronous function, that will be called for appropriate service
    */
    execute(method) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.hasServices()) {
                return Promise.reject(new Error("No services found..."));
            }
            let attempts = 0;
            const start = Date.now();
            while (true) {
                const service = attempts > 0 ? this.services.next() : this.services.currentElement();
                const elapsed = Date.now() - start;
                if ((elapsed < this.timeout)
                    && (attempts < this.attemptsLimit)) {
                    attempts++;
                    try {
                        const result = yield new Promise((resolve, reject) => {
                            const id = setTimeout(() => {
                                console.error("Service timeout...");
                                reject();
                            }, this.timeout - elapsed);
                            return method(service)
                                .then((res) => {
                                clearTimeout(id);
                                resolve(res);
                            })
                                .catch((e) => {
                                clearTimeout(id);
                                reject(e);
                            });
                        });
                        return result;
                    }
                    catch (e) {
                        console.warn("ServiceExecutor: Service error. Trying another service...");
                        continue;
                    }
                }
                else {
                    console.warn("ServiceExecutor: Services seem to be broken...");
                    console.warn("ServiceExecutor: Total attempts: " + attempts);
                    console.warn("ServiceExecutor: Time execution: " + elapsed + "ms");
                    return Promise.reject(new Error("Services seem to be broken"));
                }
            }
        });
    }
}
exports.default = ServiceExecutor;
