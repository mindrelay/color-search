import './scss/dialog.scss';
import confirmTemplate from './templates/confirm.html';
import loginTemplate from './templates/login.html';
import errorTemplate from './templates/error.html';

/**
* Module for creating dialogs
* @module dialog
*/
angular.module('dialog', [])
/** Service for creating pop-up dialogs on-the-fly
* @member {Service} popupDialog
* @memberof module:dialog
* @instance
*/
.service('popupDialog', ['$rootScope', '$compile',
function ($rootScope, $compile) {
    let scope = null;
    let element = null;
    const self = this;

    function create(template, Control, closeByOutside) {
        const html = `<div class="dialog" ng-click="close($event)">
        <div class="dialog__window">${template}</div></div>`;
        scope = $rootScope.$new(true);
        scope.$ctrl = new Control();
        scope.closeByOutside = closeByOutside;
        scope.close = ($event) => {
            const target = angular.element($event.target);
            if (target.hasClass("dialog") && scope.closeByOutside) {
                self.close();
            }
        };
        const compiled = $compile(html)(scope);
        element = angular.element(compiled).appendTo("body");
    }

    this.close = () => {
        if (element && scope) {
            element.remove();
            scope.$destroy();
            element = null;
            scope = null;
            angular.element("*").removeAttr("tabindex");
        }
    };

    this.errorDialog = (Control) => {
        this.close();
        angular.element("*").attr("tabindex", -1);
        angular.element("*").blur();
        create(errorTemplate, Control, false);
    };

    this.confirmDialog = (Control) => {
        this.close();
        angular.element("*").attr("tabindex", -1);
        angular.element("*").blur();
        create(confirmTemplate, Control, true);
    };

    this.loginDialog = (Control) => {
        this.close();
        angular.element("*").attr("tabindex", -1);
        angular.element("*").blur();
        create(loginTemplate, Control, false);
    };
}]);

export default "dialog";
