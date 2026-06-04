import {Membership} from "./Membership";

enum Position {
    RIGHT,
    LEFT,
    MIDDLE,
}

export default class TrapezoidalMembership implements Membership {

    public static position = Position;
    private a: number;
    private b: number;
    private c: number;
    private d: number;
    private strategy: (x: number) => number;

    constructor(position: Position, center: number, width: number, distance: number) {
        switch (position) {
            case Position.MIDDLE: {
                this.b = center - (width / 2);
                this.c = center + (width / 2);
                this.d = center + distance - (width / 2);
                this.a = center - distance + (width / 2);
                this.strategy = this.middle;
            }                     break;
            case Position.RIGHT: {
                this.b = center - width / 2;
                this.a = center - distance + width / 2;
                this.strategy = this.right;
            }                    break;
            case Position.LEFT: {
                this.c = center + width / 2;
                this.d = center + distance - width / 2;
                this.strategy = this.left;
            }                   break;
            default: throw new Error("Invalid position argument!");
        }
    }

    public m(x: number): number {
        return this.strategy(x);
    }

    private middle(x: number): number {
        if (x < this.a || x > this.d) {
            return 0;
        }
        if (this.a <= x && x <= this.b) {
            return (x - this.a) / (this.b - this.a);
        }
        if (this.b <= x && x <= this.c) {
            return 1;
        }
        if (this.c <= x && x <= this.d) {
            return (this.d - x) / (this.d - this.c);
        }else {
            return 0;
        }
    }

    private right(x: number): number {
        if (x < this.a) {
            return 0;
        }
        if (this.a <= x && x <= this.b) {
            return (x - this.a) / (this.b - this.a);
        }
        if (x > this.b) {
            return 1;
        }else {
            return 0;
        }
    }

    private left(x: number): number {
        if (x > this.d) {
            return 0;
        }
        if (this.c <= x && x <= this.d) {
            return (this.d - x) / (this.d - this.c);
        }
        if (x < this.c) {
            return 1;
        }else {
            return 0;
        }
    }
}
