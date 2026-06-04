import request = require("request");

export default class Flickr {
    private key: string;
    private url: string;
    constructor(key: string) {
        this.key = key;
        this.url = "https://api.flickr.com/services/rest/?";
    }

    public get(method, opts): Promise<any> {
        let url = this.url
        + "&method=flickr." + method
        + "&api_key=" + this.key
        + "&format=json"
        + "&nojsoncallback=1";

        // tslint:disable-next-line:forin
        for (const item in opts) {
            url += "&" + item + "=" + opts[item];
        }

        return new Promise((res, rej) => {
            request(url, (error, response, body) => {
                if (!error) {
                    let jsonObj;
                    try {
                        jsonObj = JSON.parse(body);
                    } catch (e) {
                        return rej(new Error("Error parsing JSON"));
                    }
                    res(jsonObj);
                }else {
                    rej(error);
                }
            });
        });
    }
}
