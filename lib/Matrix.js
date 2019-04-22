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
exports.__esModule = true;
var Validator_1 = require("./Validator");
var Base64_1 = require("./Base64");
var dataMark = [
    '[object Object]',
    '[object Array]',
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
];
var dataType = [
    null,
    null,
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array
];
var Matrix = (function () {
    function Matrix(width, height) {
        if (!Validator_1.isInteger(width) || !Validator_1.isInteger(height))
            throw RangeError('width and height must be an integer');
        if (width < 0 || height < 0)
            throw RangeError('width and height must be greater than 0');
        Object.defineProperty(this, 'width', { value: width });
        Object.defineProperty(this, 'height', { value: height });
        Object.defineProperty(this, 'total', { value: width * height });
    }
    Matrix.prototype.Validator_row = function (row) {
        if (!Validator_1.isInteger(row))
            throw TypeError('row must be an integer');
        if (row < 0 || row >= this.height)
            throw RangeError('Parameter "row" is out of range');
    };
    Matrix.prototype.Validator_column = function (column) {
        if (!Validator_1.isInteger(column))
            throw TypeError('column must be an integer');
        if (column < 0 || column >= this.width)
            throw RangeError('Parameter "column" is out of range');
    };
    Matrix.prototype.Validator_xy = function (x, y) {
        if (!Validator_1.isInteger(x) || !Validator_1.isInteger(y))
            throw TypeError('x and y must be an integer');
        if (x < 0 || x >= this.width)
            throw RangeError('x out of range');
        if (y < 0 || y >= this.height)
            throw RangeError('y out of range');
    };
    Matrix.prototype.showView = function () {
        var height = this.height;
        var y = 0;
        var view = [];
        while (y < height) {
            view.push(this.getRow(y++).join(','));
        }
        return view.join('\n');
    };
    Matrix.from = function (matrix, callback, thisArg) {
        if (matrix instanceof Matrix || (matrix.width && matrix.height && typeof matrix.get == 'function')) {
            if (matrix instanceof this && callback == undefined) {
                return matrix.clone();
            }
            else {
                var m_1 = new this(matrix.width, matrix.height);
                var cb_1 = typeof callback === 'function' ? (thisArg ? callback.bind(thisArg) : callback) : null;
                var fun = cb_1
                    ? function (v, x, y) {
                        m_1.set(x, y, cb_1(v, x, y));
                    }
                    : function (v, x, y) {
                        m_1.set(x, y, v);
                    };
                if (typeof matrix.cellForEach === 'function') {
                    matrix.cellForEach(fun);
                }
                else {
                    for (var y = 0; y < matrix.height; y++) {
                        for (var x = 0; x < matrix.width; x++) {
                            fun(matrix.get(x, y), x, y);
                        }
                    }
                }
                return m_1;
            }
        }
        else {
            var _width = void 0, _height = void 0;
            var arrayLike = matrix;
            var width = callback;
            if (width != undefined) {
                if (!Validator_1.isInteger(width))
                    throw TypeError('width must be an integer');
                if (width < 1)
                    throw RangeError('x out of range');
                _width = width;
                _height = Math.ceil(arrayLike.length / _width);
                var m = new this(_width, _height);
                for (var i = 0; i < _height; i++) {
                    m.setRow(i, arrayLike.slice(i * _width, (i + 1) * _width));
                }
                return m;
            }
            else {
                _width = arrayLike[0].length;
                _height = arrayLike.length;
                var m = new this(_width, _height);
                for (var i = 0; i < arrayLike.length; i++) {
                    m.setRow(i, arrayLike[i]);
                }
                return m;
            }
        }
    };
    Matrix.input = function (str) {
        var barray = Base64_1.decode(str);
        var baseView = new DataView(barray.buffer);
        var width = baseView.getUint32(0);
        var height = baseView.getUint32(4);
        var type = baseView.getUint8(8);
        var matrix = new this(width, height);
        var _type = dataMark.indexOf(Object.prototype.toString.call(matrix._data));
        var DataType = dataType[type];
        if (_type !== type)
            throw new TypeError('导入数据类型与当前 Matrix类型不一至!');
        if (type >= 2 && DataType) {
            matrix._data = new DataType(barray.buffer.slice(9));
        }
        else {
            matrix._data = JSON.parse(Base64_1.utf8Decode(barray.buffer.slice(9)));
        }
        return matrix;
    };
    Matrix.output = function (matrix) {
        var width = matrix.width, height = matrix.height, total = matrix.total;
        var type = dataMark.indexOf(Object.prototype.toString.call(matrix._data));
        var baseBuffer = new ArrayBuffer(9);
        var baseView = new DataView(baseBuffer);
        var data = type >= 2 ? matrix._data.buffer.slice(0) : JSON.stringify(matrix._data);
        if (type == -1)
            throw new TypeError('Matrix类型不支持导出!');
        baseView.setUint32(0, width);
        baseView.setUint32(4, height);
        baseView.setUint8(8, type);
        return Base64_1.encode(baseBuffer) + Base64_1.encode(data);
    };
    Matrix.prototype.output = function () {
        return Matrix.output(this);
    };
    return Matrix;
}());
(function (Matrix) {
    function getTypedMatrixClass(AnyMatrix, TypedArrayClass) {
        var _a;
        var name = TypedArrayClass.name.replace('Array', 'Matrix');
        return _a = (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_1.prototype._dataInit = function () {
                    this._data = new TypedArrayClass(this.total);
                };
                class_1.prototype.clone = function () {
                    return Object.create(this, {
                        _data: Object.assign(Object.getOwnPropertyDescriptor(this, '_data'), {
                            value: new TypedArrayClass(this._data.buffer.slice(0))
                        })
                    });
                };
                return class_1;
            }(AnyMatrix)),
            _a.className = name,
            _a;
    }
    Matrix.getTypedMatrixClass = getTypedMatrixClass;
})(Matrix || (Matrix = {}));
exports["default"] = Matrix;
