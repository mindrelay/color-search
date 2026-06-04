"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Position;
(function (Position) {
    Position[Position["RIGHT"] = 0] = "RIGHT";
    Position[Position["LEFT"] = 1] = "LEFT";
    Position[Position["MIDDLE"] = 2] = "MIDDLE";
})(Position || (Position = {}));
class TrapezoidalMembership {
    constructor(position, center, width, distance) {
        switch (position) {
            case Position.MIDDLE:
                {
                    this.b = center - (width / 2);
                    this.c = center + (width / 2);
                    this.d = center + distance - (width / 2);
                    this.a = center - distance + (width / 2);
                    this.strategy = this.middle;
                }
                break;
            case Position.RIGHT:
                {
                    this.b = center - width / 2;
                    this.a = center - distance + width / 2;
                    this.strategy = this.right;
                }
                break;
            case Position.LEFT:
                {
                    this.c = center + width / 2;
                    this.d = center + distance - width / 2;
                    this.strategy = this.left;
                }
                break;
            default: throw new Error("Invalid position argument!");
        }
    }
    m(x) {
        return this.strategy(x);
    }
    middle(x) {
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
        }
        else {
            return 0;
        }
    }
    right(x) {
        if (x < this.a) {
            return 0;
        }
        if (this.a <= x && x <= this.b) {
            return (x - this.a) / (this.b - this.a);
        }
        if (x > this.b) {
            return 1;
        }
        else {
            return 0;
        }
    }
    left(x) {
        if (x > this.d) {
            return 0;
        }
        if (this.c <= x && x <= this.d) {
            return (this.d - x) / (this.d - this.c);
        }
        if (x < this.c) {
            return 1;
        }
        else {
            return 0;
        }
    }
}
TrapezoidalMembership.position = Position;
exports.default = TrapezoidalMembership;
