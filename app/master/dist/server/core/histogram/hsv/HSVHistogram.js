"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Histogram_1 = require("./../Histogram");
const Membership_1 = require("./../membership/Membership");
const TrapezoidalMembership_1 = require("./../membership/TrapezoidalMembership");
const Debug = require("debug");
const debug = Debug("HSVHistogram");
class HSVColorMemberships extends Membership_1.AbstractMemberships {
    constructor(hQuantization, sQuantization, vQuantization) {
        super();
        this.memberships = new Array();
        this.size = hQuantization * sQuantization * vQuantization;
        const hStep = 360 / hQuantization;
        const hWidth = hStep / 3;
        const sCenters = new Array();
        const vCenters = new Array();
        const hMemberships = new Array();
        const sMemberships = new Array();
        const vMemberships = new Array();
        const sDistance = 100 / sQuantization;
        const sWidth = sDistance / 4;
        const sOffset = sDistance / 2;
        let l = sDistance;
        const vDistance = 100 / vQuantization;
        const vWidth = vDistance / 4;
        const vOffset = vDistance / 2;
        let k = vDistance;
        while (l <= 100) {
            sCenters.push(l - sOffset);
            l += sDistance;
        }
        while (k <= 100) {
            vCenters.push(k - vOffset);
            k += vDistance;
        }
        for (let i = 0; i <= hQuantization; i++) {
            let position = TrapezoidalMembership_1.default.position.MIDDLE;
            const center = i * hStep;
            switch (i) {
                case 0:
                    position = TrapezoidalMembership_1.default.position.LEFT;
                    break;
                case hQuantization:
                    position = TrapezoidalMembership_1.default.position.RIGHT;
                    break;
            }
            hMemberships.push(new TrapezoidalMembership_1.default(position, center, hWidth, hStep));
        }
        const sLast = sCenters.length - 1;
        for (let i = 0; i < sCenters.length; i++) {
            let position = TrapezoidalMembership_1.default.position.MIDDLE;
            const center = sCenters[i];
            switch (i) {
                case 0:
                    position = TrapezoidalMembership_1.default.position.LEFT;
                    break;
                case sLast:
                    position = TrapezoidalMembership_1.default.position.RIGHT;
                    break;
            }
            sMemberships.push(new TrapezoidalMembership_1.default(position, center, sWidth, sDistance));
        }
        const vLast = vCenters.length - 1;
        for (let i = 0; i < vCenters.length; i++) {
            let position = TrapezoidalMembership_1.default.position.MIDDLE;
            const center = vCenters[i];
            switch (i) {
                case 0:
                    position = TrapezoidalMembership_1.default.position.LEFT;
                    break;
                case vLast:
                    position = TrapezoidalMembership_1.default.position.RIGHT;
                    break;
            }
            vMemberships.push(new TrapezoidalMembership_1.default(position, center, vWidth, vDistance));
        }
        let j = 0;
        const lastHue = hMemberships.length - 1;
        for (let i = 0; i < hMemberships.length; i++) {
            for (const s of sMemberships) {
                for (const v of vMemberships) {
                    const combined = new Membership_1.CombinedMembership(hMemberships[i], s, v);
                    if (i !== lastHue) {
                        this.memberships.push([combined]);
                    }
                    else {
                        // save 'last' combined membership functions at the begin
                        // last hue = first hue
                        this.memberships[j].push(combined);
                        j++;
                    }
                }
            }
        }
    }
    getSize() {
        return this.size;
    }
}
class HSVGrayscaleMemberships extends Membership_1.AbstractMemberships {
    constructor() {
        super();
        this.memberships = new Array();
        const gsCenters = [5, 20, 35, 50, 65, 80, 95];
        this.size = gsCenters.length;
        const last = gsCenters.length - 1;
        for (let i = 0; i < gsCenters.length; i++) {
            let position = TrapezoidalMembership_1.default.position.MIDDLE;
            const center = gsCenters[i];
            switch (i) {
                case 0:
                    position = TrapezoidalMembership_1.default.position.LEFT;
                    break;
                case last:
                    position = TrapezoidalMembership_1.default.position.RIGHT;
                    break;
            }
            const membership = new TrapezoidalMembership_1.default(position, center, 10, 15);
            const combined = new Membership_1.CombinedMembership(membership);
            this.memberships.push([combined]);
        }
    }
    getSize() {
        return this.size;
    }
}
class HSVExtendedFuzzyHistogram extends Histogram_1.AbstractHistogram {
    constructor(colorMemberships, grayscaleMemberships) {
        super();
        this.colorMemberships = colorMemberships;
        this.grayscaleMemberships = grayscaleMemberships;
        const leftPosition = TrapezoidalMembership_1.default.position.LEFT;
        this.grayscale = new TrapezoidalMembership_1.default(leftPosition, 2.5, 5, 20);
        this.reset();
        debug("dimensions: " + (this.colorMemberships.getSize() + this.grayscaleMemberships.getSize()));
    }
    addColor(color) {
        if (!this.complete) {
            const grayscaleWeight = this.grayscale.m(Math.min(color.s, color.v));
            const colorWeight = 1 - grayscaleWeight;
            this.colorMemberships.addValueToHistogram(this.colorHistogramPart, [color.h, color.s, color.v], colorWeight);
            this.grayscaleMemberships.addValueToHistogram(this.greyscaleHistogramPart, [color.v], grayscaleWeight);
        }
    }
    reset() {
        this.colorHistogramPart = new Array(this.colorMemberships.getSize()).fill(0);
        this.greyscaleHistogramPart = new Array(this.grayscaleMemberships.getSize()).fill(0);
        this.histogram = new Array(this.colorMemberships.getSize() + this.grayscaleMemberships.getSize()).fill(0);
        this.complete = false;
    }
    done() {
        if (!this.complete) {
            this.histogram = this.colorHistogramPart.concat(this.greyscaleHistogramPart);
            this.colorHistogramPart = new Array();
            this.greyscaleHistogramPart = new Array();
            this.normalize();
            this.complete = true;
        }
    }
}
/**
* Creates instances of 12x5x5 trapezoidal extended fuzzy HSVHisrogram efficiently
*/
class HSVHistogramFactory {
    constructor() {
        this.colorMemberships = new HSVColorMemberships(12, 4, 4);
        this.grayScaleMemberships = new HSVGrayscaleMemberships();
    }
    createHistogram() {
        return new HSVExtendedFuzzyHistogram(this.colorMemberships, this.grayScaleMemberships);
    }
}
exports.default = HSVHistogramFactory;
