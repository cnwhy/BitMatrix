var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Matrix", "./Validator"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Matrix_1 = __importDefault(require("./Matrix"));
    var Validator_1 = require("./Validator");
    var AnyMatrix = /** @class */ (function (_super) {
        __extends(AnyMatrix, _super);
        function AnyMatrix(width, height, defaultValue) {
            if (defaultValue === void 0) { defaultValue = 0; }
            var _this = _super.call(this, width, height) || this;
            _this._dataInit();
            if (defaultValue != undefined) {
                _this.fill(defaultValue);
            }
            return _this;
        }
        AnyMatrix.prototype._dataInit = function () {
            this._data = new Array(this.total);
        };
        AnyMatrix.prototype.fill = function (value) {
            this._data.fill(value);
        };
        AnyMatrix.prototype.fillRow = function (row, value) {
            var _a = this, width = _a.width, height = _a.height, _data = _a._data;
            if (!Validator_1.isInteger(row))
                throw TypeError('row must be an integer');
            if (row < 0 || row >= height)
                throw RangeError('Parameter "row" is out of range');
            var index = width * row;
            while (width--) {
                _data[index++] = value;
            }
        };
        AnyMatrix.prototype.fillColumn = function (column, v) {
            var _a = this, width = _a.width, _data = _a._data, total = _a.total;
            if (!Validator_1.isInteger(column))
                throw TypeError('column must be an integer');
            if (column < 0 || column >= width)
                throw RangeError('Parameter "column" is out of range');
            var index = column;
            while (index < total) {
                _data[index] = v;
                index += width;
            }
        };
        AnyMatrix.prototype.get = function (x, y) {
            if (!Validator_1.isInteger(x) || !Validator_1.isInteger(y))
                throw TypeError('x and y must be an integer');
            if (x < 0 || x > this.width - 1)
                throw RangeError('x out of range');
            if (y < 0 || y > this.height - 1)
                throw RangeError('y out of range');
            return this._data[y * this.width + x];
        };
        AnyMatrix.prototype.set = function (x, y, v) {
            if (!Validator_1.isInteger(x) || !Validator_1.isInteger(y))
                throw TypeError('x and y must be an integer');
            if (x < 0 || x > this.width - 1)
                throw RangeError('x out of range');
            if (y < 0 || y > this.height - 1)
                throw RangeError('y out of range');
            this._data[y * this.width + x] = v;
        };
        AnyMatrix.prototype.getRow = function (row) {
            var _a = this, width = _a.width, height = _a.height, _data = _a._data;
            if (!Validator_1.isInteger(row))
                throw TypeError('row must be an integer');
            if (row < 0 || row >= height)
                throw RangeError('Parameter "row" is out of range');
            var start = width * row;
            // return Array.from(this._data.slice(start, start + width));
            return Array.prototype.slice.call(_data, start, start + width);
        };
        AnyMatrix.prototype.setRow = function (row, value) {
            var _a = this, width = _a.width, height = _a.height, _data = _a._data;
            if (!Validator_1.isInteger(row))
                throw TypeError('row must be an integer');
            if (row < 0 || row >= height)
                throw RangeError('Parameter "row" is out of range');
            var index = width * row;
            var _end = width * (row + 1);
            var i = 0;
            while (i < value.length && index < _end) {
                _data[index++] = value[i++];
            }
        };
        AnyMatrix.prototype.getColumn = function (column) {
            var _a = this, width = _a.width, height = _a.height, _data = _a._data, total = _a.total;
            if (!Validator_1.isInteger(column))
                throw TypeError('column must be an integer');
            if (column < 0 || column >= width)
                throw RangeError('Parameter "column" is out of range');
            var arr = [];
            var index = column;
            while (index < total) {
                arr.push(_data[index]);
                index += width;
            }
            return arr;
        };
        AnyMatrix.prototype.setColumn = function (column, value) {
            var _a = this, width = _a.width, _data = _a._data, total = _a.total;
            if (!Validator_1.isInteger(column))
                throw TypeError('column must be an integer');
            if (column < 0 || column >= width)
                throw RangeError('Parameter "column" is out of range');
            var index = column;
            var i = 0;
            while (i < value.length && index < total) {
                _data[index] = value[i++];
                index += width;
            }
        };
        AnyMatrix.prototype.cellForEach = function (fn) {
            var _a = this, _data = _a._data, width = _a.width, total = _a.total;
            var x = 0, y = 0;
            for (var i = 0; i < total; i++) {
                fn(_data[i], x, y);
                if (++x >= width) {
                    x = 0;
                    y++;
                }
            }
        };
        return AnyMatrix;
    }(Matrix_1.default));
    return AnyMatrix;
});
