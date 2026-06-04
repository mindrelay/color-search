import md5 from 'md5';

/**
* Login model. Implements user login business logic.
* @constructor:
* @param {Service} $q Angularjs '$q' service
* @param {Service} jsonrpc 'jsonrpc' service
* @memberof module:color-search
*/
class Login {

    constructor($q, jsonrpc) {
        this.required = null;
        this.auth = null;
        this.success = false;
        this.password = null;
        this.jsonrpc = jsonrpc;
        this.$q = $q;
    }

    /** Check if login data exists.
    * @method isSet
    * @return {boolean}
    * @memberof module:color-search.Login
    * @instance
    */
    isSet() {
        return this.password !== null;
    }

    /** Checks if login was successful.
    * @method isSuccessful
    * @return {boolean}
    * @memberof module:color-search.Login
    * @instance
    */
    isSuccessful() {
        return this.auth !== null && this.success;
    }

    /** Sends server login request.
    * @method login
    * @memberof module:color-search.Login
    * @instance
    */
    login() {
        const self = this;
        const auth = md5(`${this.password}`);
        return this.jsonrpc.request('login', { login: auth })
        .then((data) => {
            if (data.success) {
                self.auth = auth;
                this.success = true;
                return true;
            }
            return false;
        });
    }

    /** Sends server request and checks if login is requered.
    * @method isRequired
    * @memberof module:color-search.Login
    * @instance
    */
    isRequired() {
        if (this.required) {
            return this.$q.resolve(true);
        }
        return this.jsonrpc.request('loginRequired', {})
        .then((data) => {
            this.required = data.required;
            return this.required;
        });
    }
}

export default Login;
