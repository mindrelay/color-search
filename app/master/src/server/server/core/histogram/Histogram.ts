export interface Histogram {
    addColor(color: any): void;
    getSize(): number;
    normalize(): void;
    reset(): void;
    done(): void;
    isDone(): boolean;
    toArray(): number[];
}

export interface HistogramFactory {
    createHistogram(): Histogram;
}

export abstract class AbstractHistogram {

    protected histogram: number[];
    protected complete: boolean;

    public toArray(): number[] {
        if (this.complete) {
            return this.histogram;
        }else {
            throw new Error("'toArray' method call before 'complete' is not allowed!");
        }
    }

    public getSize(): number {
        return this.histogram.length;
    }

    public normalize() {
        let sum = 0;
        for (let i = 0; i < this.histogram.length; i++) {
            sum += this.histogram[i];
        }
        if (sum > 0) {
            for (let i = 0; i < this.histogram.length; i++) {
            this.histogram[i] = this.histogram[i] / sum;
            }
        }
    }

    public isDone(): boolean {
        return this.complete;
    }
}
