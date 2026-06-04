import CircularList from "../common/CircularList";

/**
* Service executor provides circular execution of services
* If one service is corrupt or unavailable, the next
* service will be called
*/
export default class ServiceExecutor<T> {

    private services: CircularList<T>;
    private attemptsLimit: number;
    private timeout: number;

    /**
    * Create ServiceExecutor
    * @param attemptsLimit Maximum number of attempts for each service execution
    * @param timeout Timeout for service execution
    */
    constructor(attemptsLimit: number, timeout: number) {
        this.services = new CircularList<T>();
        this.attemptsLimit = attemptsLimit;
        this.timeout = timeout;
    }

    public addService(service: T): void {
        this.services.add(service);
    }

    public servicesCount(): number {
        return this.services.size();
    }

    public hasServices(): boolean {
        return this.services.size() > 0;
    }

    /**
    * Asynchronous method for circular service execution
    * If the service is corrupt or unavailable (timeout), the next service
    * in circular list will be called
    * @param method Asynchronous function, that will be called for appropriate service
    */
    public async execute(method: (service: T) => Promise<any>): Promise<any> {
        if (!this.hasServices()) {
            return Promise.reject(new Error("No services found..."));
        }
        let attempts = 0;
        const start = Date.now();
        while (true) {
            const service: T = attempts > 0 ? this.services.next() : this.services.currentElement();
            const elapsed = Date.now() - start;
            if ((elapsed < this.timeout)
                && (attempts < this.attemptsLimit)) {
                attempts ++;
                try {
                    const result = await new Promise((resolve, reject) => {
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
                }catch (e) {
                    console.warn("ServiceExecutor: Service error. Trying another service...");
                    continue;
                }
            }else {
                console.warn("ServiceExecutor: Services seem to be broken...");
                console.warn("ServiceExecutor: Total attempts: " + attempts);
                console.warn("ServiceExecutor: Time execution: " + elapsed + "ms");
                return Promise.reject(new Error("Services seem to be broken"));
            }
        }
    }
}
