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
var AnyMatrixUseObject = (function (_super) {
    __extends(AnyMatrixUseObject, _super);
    function AnyMatrixUseObject(width, height, defaultValue) {
        var _this = _super.call(this, width, height) || this;
        var data = (_this._data = {});
        if (defaultValue !== undefined) {
            _this.fill(defaultValue);
        }
        return _this;
    }
    AnyMatrixUseObject.prototype.clone = function () {
        return Object.create(this, {
            _data: Object.assign(Object.getOwnPropertyDescriptor(this, '_data'), {
                value: Object.assign({}, this._data)
            })
        });
    };
    AnyMatrixUseObject.prototype.getPrototypeData = function () {
        return this._data;
    };
    AnyMatrixUseObject.prototype.fill = function (v) {
        var data = this._data;
        var max = this.total;
        while (max--) {
            data[max] = v;
        }
    };
    AnyMatrixUseObject.prototype.fillRow = function (row, value) {
        this.Validator_row(row);
        var _a = this, width = _a.width, _data = _a._data;
        var index = width * row;
        while (width--) {
            _data[index++] = value;
        }
    };
    AnyMatrixUseObject.prototype.fillColumn = function (column, v) {
        this.Validator_column(column);
        var _a = this, width = _a.width, _data = _a._data, total = _a.total;
        var index = column;
        while (index < total) {
            _data[index] = v;
            index += width;
        }
    };
    AnyMatrixUseObject.prototype.get = function (x, y) {
        this.Validator_xy(x, y);
        return this._data[y * this.width + x];
    };
    AnyMatrixUseObject.prototype.set = function (x, y, v) {
        this.Validator_xy(x, y);
        this._data[y * this.width + x] = v;
    };
    AnyMatrixUseObject.prototype.getRow = function (row) {
        this.Validator_row(row);
        var _a = this, width = _a.width, _data = _a._data;
        var index = width * row;
        var arr = [];
        while (width--) {
            arr.push(_data[index++]);
        }
        return arr;
    };
    AnyMatrixUseObject.prototype.setRow = function (row, value) {
        this.Validator_row(row);
        var _a = this, width = _a.width, height = _a.height, _data = _a._data;
        var index = width * row;
        var _end = width * (row + 1);
        var i = 0;
        while (i < value.length && index < _end) {
            _data[index++] = value[i++];
        }
    };
    AnyMatrixUseObject.prototype.getColumn = function (column) {
        this.Validator_column(column);
        var _a = this, width = _a.width, _data = _a._data, total = _a.total;
        var arr = [];
        var index = column;
        while (index < total) {
            arr.push(_data[index]);
            index += width;
        }
        return arr;
    };
    AnyMatrixUseObject.prototype.setColumn = function (column, value) {
        this.Validator_column(column);
        var _a = this, width = _a.width, _data = _a._data, total = _a.total;
        var index = column;
        var i = 0;
        while (i < value.length && index < total) {
            _data[index] = value[i++];
            index += width;
        }
    };
    AnyMatrixUseObject.prototype.cellForEach = function (fn) {
        var _a = this, _data = _a._data, width = _a.width, total = _a.total;
        var x = 0;
        var y = 0;
        for (var i = 0; i < total; i++) {
            fn(_data[i], x, y);
            if (++x >= width) {
                x = 0;
                y++;
            }
        }
    };
    return AnyMatrixUseObject;
}(Matrix_1["default"]));
exports["default"] = AnyMatrixUseObject;
