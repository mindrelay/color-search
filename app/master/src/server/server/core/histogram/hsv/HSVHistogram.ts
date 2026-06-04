import { AbstractHistogram, Histogram, HistogramFactory } from "./../Histogram";
import {AbstractMemberships, CombinedMembership, Membership} from "./../membership/Membership";
import TrapezoidalMembership from "./../membership/TrapezoidalMembership";
import HSVColor from "./HSVColor";
import Debug = require("debug");
const debug = Debug("HSVHistogram");

class HSVColorMemberships extends AbstractMemberships {
    private size: number;
    constructor(hQuantization: number, sQuantization: number, vQuantization: number) {
        super();
        this.memberships = new Array<CombinedMembership[]>();
        this.size = hQuantization * sQuantization * vQuantization;
        const hStep = 360 / hQuantization;
        const hWidth = hStep / 3;
        const sCenters = new Array<number>();
        const vCenters = new Array<number>();
        const hMemberships = new Array<Membership>();
        const sMemberships = new Array<Membership>();
        const vMemberships = new Array<Membership>();

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
            let position = TrapezoidalMembership.position.MIDDLE;
            const center = i * hStep;
            switch (i) {
                case 0: position = TrapezoidalMembership.position.LEFT; break;
                case hQuantization: position = TrapezoidalMembership.position.RIGHT; break;
            }
            hMemberships.push(new TrapezoidalMembership(position, center, hWidth, hStep));
        }

        const sLast = sCenters.length - 1;
        for (let i = 0; i < sCenters.length; i++) {
            let position = TrapezoidalMembership.position.MIDDLE;
            const center = sCenters[i];
            switch (i) {
                case 0: position = TrapezoidalMembership.position.LEFT; break;
                case sLast: position = TrapezoidalMembership.position.RIGHT; break;
            }
            sMemberships.push(new TrapezoidalMembership(position, center, sWidth, sDistance));
        }

        const vLast = vCenters.length - 1;
        for (let i = 0; i < vCenters.length; i++) {
            let position = TrapezoidalMembership.position.MIDDLE;
            const center = vCenters[i];
            switch (i) {
                case 0: position = TrapezoidalMembership.position.LEFT; break;
                case vLast: position = TrapezoidalMembership.position.RIGHT; break;
            }
            vMemberships.push(new TrapezoidalMembership(position, center, vWidth, vDistance));
        }

        let j = 0;
        const lastHue: number = hMemberships.length - 1;
        for (let i = 0; i < hMemberships.length; i++) {
            for (const s of sMemberships) {
                for (const v of vMemberships) {
                    const combined = new CombinedMembership(hMemberships[i], s, v);
                    if (i !== lastHue) {
                        this.memberships.push([combined]);
                    }else {
                        // save 'last' combined membership functions at the begin
                        // last hue = first hue
                        this.memberships[j].push(combined);
                        j++;
                    }
                }
            }
        }
    }

    public getSize(): number {
        return this.size;
    }
}

class HSVGrayscaleMemberships extends AbstractMemberships {
    private size: number;
    constructor() {
        super();
        this.memberships = new Array<CombinedMembership[]>();
        const gsCenters = [5, 20, 35, 50, 65, 80, 95];
        this.size = gsCenters.length;
        const last: number = gsCenters.length - 1;
        for (let i = 0; i < gsCenters.length; i++) {
            let position = TrapezoidalMembership.position.MIDDLE;
            const center = gsCenters[i];
            switch (i) {
                case 0: position = TrapezoidalMembership.position.LEFT; break;
                case last: position = TrapezoidalMembership.position.RIGHT; break;
            }
            const membership = new TrapezoidalMembership(position, center, 10, 15);
            const combined = new CombinedMembership(membership);
            this.memberships.push([combined]);
        }
    }

    public getSize(): number {
        return this.size;
    }
}

class HSVExtendedFuzzyHistogram extends AbstractHistogram implements Histogram {
    private grayscale: TrapezoidalMembership;
    private greyscaleHistogramPart: number[];
    private colorHistogramPart: number[];
    private colorMemberships: HSVColorMemberships;
    private grayscaleMemberships: HSVGrayscaleMemberships;

    constructor(colorMemberships: HSVColorMemberships, grayscaleMemberships: HSVGrayscaleMemberships) {
        super();
        this.colorMemberships = colorMemberships;
        this.grayscaleMemberships = grayscaleMemberships;
        const leftPosition = TrapezoidalMembership.position.LEFT;
        this.grayscale = new TrapezoidalMembership(leftPosition, 2.5, 5, 20);
        this.reset();
        debug("dimensions: " + (this.colorMemberships.getSize() + this.grayscaleMemberships.getSize()));
    }

    public addColor(color: HSVColor): void {
        if (!this.complete) {
            const grayscaleWeight = this.grayscale.m(Math.min(color.s, color.v));
            const colorWeight = 1 - grayscaleWeight;
            this.colorMemberships.addValueToHistogram(this.colorHistogramPart,
            [color.h, color.s, color.v], colorWeight);
            this.grayscaleMemberships.addValueToHistogram(this.greyscaleHistogramPart, [color.v], grayscaleWeight);
        }
    }

    public reset(): void {
        this.colorHistogramPart = new Array<number>(this.colorMemberships.getSize()).fill(0);
        this.greyscaleHistogramPart = new Array<number>(this.grayscaleMemberships.getSize()).fill(0);
        this.histogram = new Array(this.colorMemberships.getSize() + this.grayscaleMemberships.getSize()).fill(0);
        this.complete = false;
    }

    public done(): void {
        if (!this.complete) {
            this.histogram = this.colorHistogramPart.concat(this.greyscaleHistogramPart);
            this.colorHistogramPart = new Array<number>();
            this.greyscaleHistogramPart = new Array<number>();
            this.normalize();
            this.complete = true;
        }
    }
}

/**
* Creates instances of 12x5x5 trapezoidal extended fuzzy HSVHisrogram efficiently
*/
export default class HSVHistogramFactory implements HistogramFactory {
    private colorMemberships: HSVColorMemberships;
    private grayScaleMemberships: HSVGrayscaleMemberships;

    constructor() {
        this.colorMemberships = new HSVColorMemberships(12, 4, 4);
        this.grayScaleMemberships = new HSVGrayscaleMemberships();
    }

    public createHistogram(): HSVExtendedFuzzyHistogram {
        return new HSVExtendedFuzzyHistogram(this.colorMemberships, this.grayScaleMemberships);
    }
}
