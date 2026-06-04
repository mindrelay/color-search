import request = require("request");
import Debug = require("debug");
const debug = Debug("JsonRPC");

export default class JsonRPC {

    private constructor() {}

    public static async request<T>(url: string, method: string, data: any, secret: string): Promise<T> {
        debug("request...");
        return await new Promise<T>((res, rej) => {
            request({
                method: "POST",
                headers : {
                    Authorization : secret
                },
                uri: url,
                body: JsonRPC.requestMessage(method, data),
                json: true,
                }, (error, response, body) => {
                if (!error && body.result !== undefined) {
                    res(body.result);
                } else {
                    rej(error || body.error);
                }
            });
        });
    }

    private static requestMessage(methodName: string, args: any) {
        return {
            jsonrpc: "2.0",
            id: null,
            method: methodName,
            params: args,
        };
    }
}
