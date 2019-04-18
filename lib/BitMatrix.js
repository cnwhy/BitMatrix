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
        // for(let i = start; i< end; i++){
        // 	if(_arr)
        // }
    }
    var BitMatrix = /** @class */ (function (_super) {
        __extends(BitMatrix, _super);
        function BitMatrix(width, height, defaultValue) {
            if (defaultValue === void 0) { defaultValue = 0; }
            var _this = _super.call(this, width, height) || this;
            // this.data = new ArrayBuffer(Math.ceil((width * height) / 8));
            // this.byteArray = new Uint8Array(this.data);
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
            var _a = this, width = _a.width, height = _a.height, _data = _a._data, total = _a.total;
            if (!Validator_1.isInteger(row))
                throw TypeError('row must be an integer');
            if (row < 0 || row >= height)
                throw RangeError('Parameter "row" is out of range');
            var start = this.getIndex(0, row);
            var end = this.getIndex(width - 1, row);
            if (start.index === end.index) {
                // return Bit2Array(_data[start.index], start.offset, end.offset + 1);
                if (value) {
                    _data[start.index] |= (Math.pow(2, width) - 1) << start.offset;
                }
                else {
                    _data[start.index] &=
                        ((Math.pow(2, start.offset) - 1) << (8 - start.offset)) | (Math.pow(2, (8 - end.offset - 1)) - 1);
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
            var _a = this, width = _a.width, height = _a.height, _data = _a._data, total = _a.total;
            if (!Validator_1.isInteger(column))
                throw TypeError('column must be an integer');
            if (column < 0 || column >= width)
                throw RangeError('Parameter "column" is out of range');
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
            // console.log(index, offset);
            // return !!((1 << offset) & this._byteArray[index]);
            return (this._data[index] >> offset) & 1;
        };
        BitMatrix.prototype.set = function (x, y, v) {
            var _a = this.getIndex(x, y), index = _a.index, offset = _a.offset;
            // console.log(index, offset);
            // let ov = this.byteArray[index];
            if (v) {
                this._data[index] |= 1 << offset;
            }
            else {
                this._data[index] &= ~(1 << offset);
            }
        };
        BitMatrix.prototype.getRow = function (row) {
            var _a = this, width = _a.width, height = _a.height, _data = _a._data;
            if (!Validator_1.isInteger(row))
                throw TypeError('row must be an integer');
            if (row < 0 || row >= height)
                throw RangeError('Parameter "row" is out of range');
            var start = this.getIndex(0, row);
            var end = this.getIndex(width - 1, row);
            //width <= 8时可能出现
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
            if (!Validator_1.isInteger(row))
                throw TypeError('row must be an integer');
            if (row < 0 || row >= height)
                throw RangeError('Parameter "row" is out of range');
            var start = this.getIndex(0, row);
            var end = this.getIndex(width - 1, row);
            var i = 0;
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
            // if (value) {
            // 	_data[start.index] |= 0xff << start.offset;
            // 	_data[end.index] |= 0xff >> (7 - end.offset);
            // } else {
            // 	_data[start.index] &= 0xff >> (8 - start.offset);
            // 	_data[end.index] &= 0xff << (end.offset + 1);
            // }
            // for (let index = start.index + 1; index < end.index; index++) {
            // 	_data[index] = value ? 0xff : 0;
            // }
        };
        BitMatrix.prototype.getColumn = function (column) {
            var _a = this, width = _a.width, height = _a.height, _data = _a._data, total = _a.total;
            if (!Validator_1.isInteger(column))
                throw TypeError('column must be an integer');
            if (column < 0 || column >= width)
                throw RangeError('Parameter "column" is out of range');
            var arr = [];
            var h = 0;
            while (h < height) {
                arr.push(this.get(column, h++));
            }
            return arr;
        };
        BitMatrix.prototype.setColumn = function (column, value) {
            var _a = this, width = _a.width, height = _a.height, _data = _a._data, total = _a.total;
            if (!Validator_1.isInteger(column))
                throw TypeError('column must be an integer');
            if (column < 0 || column >= width)
                throw RangeError('Parameter "column" is out of range');
            var h = 0;
            var i = 0;
            while (i < value.length && h < height) {
                this.set(column, i, value[i++]);
            }
        };
        BitMatrix.prototype.cellForEach = function (fn) {
            var _a = this, width = _a.width, height = _a.height, length = _a.total, byteArray = _a._data;
            // let n = 0;
            var x = 0, y = 0;
            var blength = byteArray.length;
            for (var i = 0; i < blength; i++) {
                var v = byteArray[i];
                for (var b = 0; b < 8; b++) {
                    // let [_x,_y] = this.getPosition(n);
                    // fn(!!((v >> b) & 1),_x,_y);
                    // fn.apply(null, [!!((v >> b) & 1)]);
                    fn((v >> b) & 1, x, y);
                    if (++x >= width) {
                        x = 0;
                        y++;
                        if (y >= height)
                            return;
                    }
                    // if (++n >= length) return;
                }
            }
        };
        // rowForEach(fn: (v: boolean[], y: number) => void) {
        // 	return [];
        // }
        // columnForEach(fn: (v: boolean[], x: number) => void) {
        // 	return [];
        // }
        BitMatrix.prototype.getIndex = function (x, y) {
            if (!Validator_1.isInteger(x) || !Validator_1.isInteger(y))
                throw TypeError('x and y must be an integer');
            if (x < 0 || x > this.width - 1) {
                throw RangeError('x out of range');
            }
            if (y < 0 || y > this.height - 1) {
                throw RangeError('y out of range');
            }
            var n = y * this.width + x + 1;
            return {
                index: Math.ceil(n / 8) - 1,
                // offset: (8 - n % 8) % 8   //01234567,89abcdef
                offset: (n - 1) % 8 //76543210,fedcba98
            };
        };
        return BitMatrix;
    }(Matrix_1.default));
    return BitMatrix;
});
