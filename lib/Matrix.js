"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = require("./Validator");
const Base64 = __importStar(require("@cnwhy/base64"));
const dataMark = [
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
const dataType = [
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
class Matrix {
    constructor(width, height) {
        if (!Validator_1.isInteger(width) || !Validator_1.isInteger(height))
            throw RangeError('width and height must be an integer');
        if (width < 0 || height < 0)
            throw RangeError('width and height must be greater than 0');
        Object.defineProperty(this, 'width', { value: width });
        Object.defineProperty(this, 'height', { value: height });
        Object.defineProperty(this, 'total', { value: width * height });
    }
    Validator_row(row) {
        if (!Validator_1.isInteger(row))
            throw TypeError('row must be an integer');
        if (row < 0 || row >= this.height)
            throw RangeError('Parameter "row" is out of range');
    }
    Validator_column(column) {
        if (!Validator_1.isInteger(column))
            throw TypeError('column must be an integer');
        if (column < 0 || column >= this.width)
            throw RangeError('Parameter "column" is out of range');
    }
    Validator_xy(x, y) {
        if (!Validator_1.isInteger(x) || !Validator_1.isInteger(y))
            throw TypeError('x and y must be an integer');
        if (x < 0 || x >= this.width)
            throw RangeError('x out of range');
        if (y < 0 || y >= this.height)
            throw RangeError('y out of range');
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
    static from(matrix, callback, thisArg) {
        if (matrix instanceof Matrix || (matrix.width && matrix.height && typeof matrix.get == 'function')) {
            if (matrix instanceof this && callback == undefined) {
                return matrix.clone();
            }
            else {
                let m = new this(matrix.width, matrix.height);
                let cb = typeof callback === 'function' ? (thisArg ? callback.bind(thisArg) : callback) : null;
                let fun = cb
                    ? (v, x, y) => {
                        m.set(x, y, cb(v, x, y));
                    }
                    : (v, x, y) => {
                        m.set(x, y, v);
                    };
                if (typeof matrix.cellForEach === 'function') {
                    matrix.cellForEach(fun);
                }
                else {
                    for (let y = 0; y < matrix.height; y++) {
                        for (let x = 0; x < matrix.width; x++) {
                            fun(matrix.get(x, y), x, y);
                        }
                    }
                }
                return m;
            }
        }
        else {
            let _width, _height;
            let arrayLike = matrix;
            let width = callback;
            if (width != undefined) {
                if (!Validator_1.isInteger(width))
                    throw TypeError('width must be an integer');
                if (width < 1)
                    throw RangeError('x out of range');
                _width = width;
                _height = Math.ceil(arrayLike.length / _width);
                let m = new this(_width, _height);
                for (let i = 0; i < _height; i++) {
                    m.setRow(i, arrayLike.slice(i * _width, (i + 1) * _width));
                }
                return m;
            }
            else {
                _width = arrayLike[0].length;
                _height = arrayLike.length;
                let m = new this(_width, _height);
                for (let i = 0; i < arrayLike.length; i++) {
                    m.setRow(i, arrayLike[i]);
                }
                return m;
            }
        }
    }
    static input(base64) {
        let barray = Base64.decode(base64);
        let baseView = new DataView(barray.buffer);
        let width = baseView.getUint32(0);
        let height = baseView.getUint32(4);
        let type = baseView.getUint8(8);
        let matrix = new this(width, height);
        let _type = dataMark.indexOf(Object.prototype.toString.call(matrix._data));
        let DataType = dataType[type];
        if (_type !== type)
            throw new TypeError('导入数据类型与当前 Matrix类型不一至!');
        if (type >= 2 && DataType) {
            matrix._data = new DataType(barray.buffer.slice(9));
        }
        else {
            matrix._data = JSON.parse(Base64.utf8Decode(barray.buffer.slice(9)));
        }
        return matrix;
    }
    static output(matrix) {
        if (!(matrix instanceof Matrix))
            throw new TypeError('The parameter must be a Matrix type');
        let { width, height, total } = matrix;
        let type = dataMark.indexOf(Object.prototype.toString.call(matrix._data));
        let baseBuffer = new ArrayBuffer(9);
        let baseView = new DataView(baseBuffer);
        let data = type >= 2 ? matrix._data.buffer.slice(0) : JSON.stringify(matrix._data);
        if (type == -1)
            throw new TypeError('Matrix类型不支持导出!');
        baseView.setUint32(0, width);
        baseView.setUint32(4, height);
        baseView.setUint8(8, type);
        return Base64.encode(baseBuffer) + Base64.encode(data);
    }
    output() {
        return Matrix.output(this);
    }
}
exports.default = Matrix;
