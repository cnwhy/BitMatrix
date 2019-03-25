var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./AnyMatrix"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const AnyMatrix_1 = __importDefault(require("./AnyMatrix"));
    class Uint32Matrix extends AnyMatrix_1.default {
        constructor(width, height) {
            super(width, height);
        }
        _dataInit() {
            this._data = new Uint32Array(this.total);
        }
    }
    exports.default = Uint32Matrix;
});
