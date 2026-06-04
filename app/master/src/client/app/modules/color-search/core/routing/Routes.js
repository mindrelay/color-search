/**
* Routes to pages
* @constructor
* @param {$stateProvider} $stateProvider UI router '$stateProvider'
* @param {$urlRouterProvider} $urlRouterProvider UI router '$urlRouterProvider'
* @memberof module:color-search
*/
function Routes($stateProvider, $urlRouterProvider) {
    const mainState = {
        name: 'main',
        url: '/main',
        data: { page: "main" },
    };

    const settingsState = {
        name: 'main.profiles',
        url: '^/profiles',
        data: { page: "profiles" },
    };

    const guideState = {
        name: 'main.guide',
        url: '^/guide',
        data: { page: "guide" },
    };

    $stateProvider.state(mainState);
    $stateProvider.state(settingsState);
    $stateProvider.state(guideState);
    $urlRouterProvider.otherwise('/main');
}

Routes.$inject = ['$stateProvider', '$urlRouterProvider'];
export default Routes;

