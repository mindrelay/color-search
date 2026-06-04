class JsonRpcException {
    constructor(error) {
        this.name = "jsonRpcException";
        this.message = error;
    }
}

/**
* Connects with server using AJAX and sends
* requests in JSON-RPC 2.0 message format.
* @module jsonrpc
*/
angular.module('jsonrpc', [])
.provider('$JsonRpc', function () {
    let url = "";
    this.set = (conf) => {
        url = conf["url"];
    };
    this.$get = () => ({
        url,
    });
})
/** Service for JSON-RPC 2.0 requests.
* @member {Service} jsonrpc
* @memberof module:jsonrpc
* @instance
*/
.service("jsonrpc", ["$q", "$http", "$JsonRpc", function ($q, $http, jsonrpcConfig) {
    const _url = jsonrpcConfig.url;
    if (!_url) {
        throw new JsonRpcException('Please configure server url');
    }
    let _id = 0;
    this.request = (method, params) => {
        const deferred = $q.defer();
        const req = {
            method: 'POST',
            url: _url,
            headers: { 'Content-Type': 'application/json' },
            data: _getInputData(method, params),
        };

        $http(req).then((res) => {
            const data = res.data;
            if (!res || !data) {
                deferred.reject(new JsonRpcException("Unknown Error occured. No data received"));
            } else if (data && data.result !== undefined) {
                if (!_inspectDataFormat(data)) {
                    deferred.reject(new JsonRpcException("JSON-RPC 2.0 data format must be used."));
                } else {
                    deferred.resolve(data.result);
                }
            } else {
                console.log(data);
                deferred.reject(new JsonRpcException(`No data received. HTTP status code: ${data.error.status}`));
            }
        }, (error) => {
            if (error) {
                deferred.reject(new JsonRpcException(`Error occured. HTTP status code: ${error.status}`));
            } else {
            deferred.reject(new JsonRpcException("Unknown Error occurred"));
            }
        });
        return deferred.promise;
    };

    function _getInputData(methodName, args) {
    _id += 1;
        return {
            jsonrpc: '2.0',
            id: _id,
            method: methodName,
            params: args,
        };
    }

    function _inspectDataFormat(data) {
        const allowedKeys = ["jsonrpc", "id", "result"];
        const keys = Object.keys(data);
        let ret = false;
        if (keys.length === allowedKeys.length) {
            ret = true;
            keys.forEach((key) => {
                if (allowedKeys.indexOf(key) < 0) {
                    ret = false;
                }
                if (key === "jsonrpc" && data[key] !== "2.0") {
                    ret = false;
                }
            });
        }
        return ret;
    }
}]);


export default 'jsonrpc';
