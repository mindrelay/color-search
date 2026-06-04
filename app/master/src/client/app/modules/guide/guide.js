import './scss/guide.scss';
import template from './template/guide.html';

/**
* Module 
* @module guide
*/
angular.module('guide', [])
/** Guide component. Represents a 'guide' page in the web application.
* @member {Component} guide
* @property {String} template
* @memberof module:guide
* @instance
*/
.component('guide', {
    template,
});

export default 'guide';
