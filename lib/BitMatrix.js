"use strict";
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
exports.__esModule = true;
var Matrix_1 = __importDefault(require("./Matrix"));
function Bit2Array(byte, start, end) {
    if (start === void 0) { start = 0; }
    var arr = [];
    var v = byte >> start;
    end = end && end < 8 ? end : 8;
    for (var i = start; i < end; i++) {
        arr.push(v & 1 ? 1 : 0);
        v >>= 1;
    }
    return arr;
}
function ArraySetBit(byte, arr, start, end) {
    if (start === void 0) { start = 0; }
    end = end && end < 8 ? end : 8;
    var index = start, i = 0;
    while (index < end && i < arr.length) {
        if (arr[i]) {
            byte |= 1 << index;
        }
        else {
            byte &= ~(1 << index);
        }
        i++, index++;
    }
    return byte;
}
var BitMatrix = (function (_super) {
    __extends(BitMatrix, _super);
    function BitMatrix(width, height, defaultValue) {
        if (defaultValue === void 0) { defaultValue = 0; }
        var _this = _super.call(this, width, height) || this;
        _this._data = new Uint8Array(Math.ceil((width * height) / 8));
        if (defaultValue) {
            _this._data.fill(255);
        }
        return _this;
    }
    BitMatrix.prototype.clone = function () {
        return Object.create(this, {
            _data: Object.assign(Object.getOwnPropertyDescriptor(this, '_data'), {
                value: new Uint8Array(this._data.buffer.slice(0))
            })
        });
    };
    BitMatrix.prototype.getPrototypeData = function () {
        return this._data;
    };
    BitMatrix.prototype.fill = function (value) {
        this._data.fill(!!value ? 255 : 0);
    };
    BitMatrix.prototype.fillRow = function (row, value) {
        this.Validator_row(row);
        var _a = this, width = _a.width, height = _a.height, _data = _a._data, total = _a.total;
        var start = this.getIndex(0, row);
        var end = this.getIndex(width - 1, row);
        if (start.index === end.index) {
            if (value) {
                _data[start.index] |= (Math.pow(2, width) - 1) << start.offset;
            }
            else {
                _data[start.index] &= 0xff >> (8 - start.offset) | 0xFF << (end.offset + 1);
            }
            return;
        }
        if (value) {
            _data[start.index] |= 0xff << start.offset;
            _data[end.index] |= 0xff >> (7 - end.offset);
        }
        else {
            _data[start.index] &= 0xff >> (8 - start.offset);
            _data[end.index] &= 0xff << (end.offset + 1);
        }
        for (var index = start.index + 1; index < end.index; index++) {
            _data[index] = value ? 0xff : 0;
        }
    };
    BitMatrix.prototype.fillColumn = function (column, v) {
        this.Validator_column(column);
        var _a = this, width = _a.width, height = _a.height, _data = _a._data, total = _a.total;
        var set = (function () {
            if (v) {
                return function (i, offset) {
                    _data[i] |= 1 << offset;
                };
            }
            else {
                return function (i, offset) {
                    _data[i] &= ~(1 << offset);
                };
            }
        })();
        for (var h = 0; h < height; h++) {
            var _b = this.getIndex(column, h), index = _b.index, offset = _b.offset;
            set(index, offset);
        }
    };
    BitMatrix.prototype.get = function (x, y) {
        var _a = this.getIndex(x, y), index = _a.index, offset = _a.offset;
        return (this._data[index] >> offset) & 1;
    };
    BitMatrix.prototype.set = function (x, y, v) {
        var _a = this.getIndex(x, y), index = _a.index, offset = _a.offset;
        if (v) {
            this._data[index] |= 1 << offset;
        }
        else {
            this._data[index] &= ~(1 << offset);
        }
    };
    BitMatrix.prototype.getRow = function (row) {
        var _a = this, width = _a.width, height = _a.height, _data = _a._data;
        var start = this.getIndex(0, row);
        var end = this.getIndex(width - 1, row);
        if (start.index === end.index) {
            return Bit2Array(_data[start.index], start.offset, end.offset + 1);
        }
        var arr = Bit2Array(_data[start.index], start.offset);
        for (var index = start.index + 1; index < end.index; index++) {
            arr = arr.concat(Bit2Array(_data[index]));
        }
        arr = arr.concat(Bit2Array(_data[end.index], 0, end.offset + 1));
        return arr;
    };
    BitMatrix.prototype.setRow = function (row, value) {
        var _a = this, width = _a.width, height = _a.height, _data = _a._data, total = _a.total;
        var start = this.getIndex(0, row);
        var end = this.getIndex(width - 1, row);
        var i = 0;
        if (start.index === end.index) {
            _data[start.index] = ArraySetBit(_data[start.index], value, start.offset, start.offset + width);
            return;
        }
        _data[start.index] = ArraySetBit(_data[start.index], value, start.offset);
        i = 8 - start.offset;
        for (var index = start.index + 1; index < end.index && i < value.length; index++) {
            var byte = _data[index];
            _data[index] = ArraySetBit(byte, value.slice(i));
            i += 8;
        }
        if (i >= value.length)
            return;
        _data[end.index] = ArraySetBit(_data[end.index], value.slice(i), 0, end.offset + 1);
    };
    BitMatrix.prototype.getColumn = function (column) {
        this.Validator_column(column);
        var height = this.height;
        var arr = [];
        var h = 0;
        while (h < height) {
            arr.push(this.get(column, h++));
        }
        return arr;
    };
    BitMatrix.prototype.setColumn = function (column, value) {
        this.Validator_column(column);
        var height = this.height;
        var i = 0;
        while (i < value.length && i < height) {
            this.set(column, i, value[i++]);
        }
    };
    BitMatrix.prototype.cellForEach = function (fn) {
        var _a = this, width = _a.width, height = _a.height, length = _a.total, byteArray = _a._data;
        var x = 0, y = 0;
        var blength = byteArray.length;
        for (var i = 0; i < blength; i++) {
            var v = byteArray[i];
            for (var b = 0; b < 8; b++) {
                fn((v >> b) & 1, x, y);
                if (++x >= width) {
                    x = 0;
                    y++;
                    if (y >= height)
                        return;
                }
            }
        }
    };
    BitMatrix.prototype.getIndex = function (x, y) {
        this.Validator_xy(x, y);
        var n = y * this.width + x + 1;
        return {
            index: Math.ceil(n / 8) - 1,
            offset: (n - 1) % 8
        };
    };
    return BitMatrix;
}(Matrix_1["default"]));
exports["default"] = BitMatrix;
