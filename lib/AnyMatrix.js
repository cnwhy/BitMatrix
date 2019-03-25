var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Matrix.I"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Matrix_I_1 = __importDefault(require("./Matrix.I"));
    class AnyMatrix extends Matrix_I_1.default {
        constructor(width, height, defaultValue = 0) {
            super(width, height);
            this._dataInit();
            if (defaultValue != undefined) {
                this.fill(defaultValue);
            }
        }
        _dataInit() {
            this._data = new Array(this.total);
        }
        fill(value) {
            this._data.fill(value);
        }
        fillRow(row, value) {
            let { width, height, _data } = this;
            if (row < 0 || row >= height)
                throw RangeError('Parameter "row" is out of range');
            let index = width * row;
            while (width--) {
                _data[index++] = value;
            }
        }
        fillColumn(column, v) {
            let { width, _data, total } = this;
            if (column < 0 || column >= width)
                throw RangeError('Parameter "column" is out of range');
            let index = column;
            while (index < total) {
                _data[index] = v;
                index += width;
            }
        }
        get(x, y) {
            if (x < 0 || x > this.width - 1) {
                throw RangeError('x out of range');
            }
            if (y < 0 || y > this.height - 1) {
                throw RangeError('y out of range');
            }
            return this._data[y * this.width + x];
        }
        set(x, y, v) {
            if (x < 0 || x > this.width - 1) {
                throw RangeError('x out of range');
            }
            if (y < 0 || y > this.height - 1) {
                throw RangeError('y out of range');
            }
            this._data[y * this.width + x] = v;
        }
        getRow(row) {
            let { width, height, _data } = this;
            if (row < 0 || row >= height)
                throw RangeError('Parameter "row" is out of range');
            let start = width * row;
            return Array.from(this._data.slice(start, start + width));
        }
        setRow(row, value) {
            let { width, height, _data } = this;
            if (row < 0 || row >= height)
                throw RangeError('Parameter "row" is out of range');
            let index = width * row;
            let _end = width * (row + 1);
            let i = 0;
            while (i < value.length && index < _end) {
                _data[index++] = value[i++];
            }
        }
        getColumn(column) {
            let { width, height, _data, total } = this;
            if (column < 0 || column >= width)
                throw RangeError('Parameter "column" is out of range');
            let arr = [];
            let index = column;
            while (index < total) {
                arr.push(_data[index]);
                index += width;
            }
            return arr;
        }
        setColumn(column, value) {
            let { width, _data, total } = this;
            if (column < 0 || column >= width)
                throw RangeError('Parameter "column" is out of range');
            let index = column;
            let i = 0;
            while (i < value.length && index < total) {
                _data[index] = value[i++];
                index += width;
            }
        }
        cellForEach(fn) {
            let { _data: data, width, total: length } = this;
            let x = 0, y = 0;
            for (let i = 0; i < length; i++) {
                fn(data[i], x, y);
                if (++x >= width) {
                    x = 0;
                    y++;
                }
            }
        }
        showView() {
            let { height } = this;
            let y = 0;
            let view = [];
            while (y < height) {
                view.push(this.getRow(y++).join(','));
            }
            return view.join('\n');
        }
    }
    exports.default = AnyMatrix;
});
