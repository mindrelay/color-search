"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CircularList {
    constructor() {
        this.elements = new Array();
        this.currentIndex = 0;
    }
    size() {
        return this.elements.length;
    }
    clear() {
        this.elements = new Array();
        this.currentIndex = 0;
    }
    currentElement() {
        if (this.elements.length > 0) {
            return this.elements[this.currentIndex];
        }
        return null;
    }
    indexOf(element) {
        return this.elements.indexOf(element);
    }
    add(element) {
        this.elements.push(element);
    }
    remove(index) {
        if (index < this.elements.length) {
            this.elements.splice(index, 1);
        }
    }
    getElement(index) {
        if (index < this.elements.length) {
            return this.elements[index];
        }
        return null;
    }
    has(element) {
        return this.elements.includes(element);
    }
    next() {
        if (this.elements.length > 0) {
            this.currentIndex = (this.currentIndex + 1) < this.elements.length ? (this.currentIndex + 1) : 0;
            return this.elements[this.currentIndex];
        }
        return null;
    }
    prev() {
        if (this.elements.length > 0) {
            this.currentIndex = (this.currentIndex - 1) > 0 ? (this.currentIndex - 1) : this.elements.length - 1;
            return this.elements[this.currentIndex];
        }
        return null;
    }
    getCurrentIndex() {
        return this.currentIndex;
    }
    setCurrentIndex(index) {
        if (index >= 0 && index < this.elements.length) {
            this.currentIndex = index;
        }
    }
}
exports.default = CircularList;
