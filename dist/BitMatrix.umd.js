(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.BitMatrix = {}));
}(this, function (exports) { 'use strict';

    /*!
     * @cnwhy/base64  v0.1.1
     * Homepage https://github.com/cnwhy/Base64.js#readme
     * License MIT
     */

    const BASE64_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
    const BASE64_URL_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.split('');
    const PAD = '=';
    const ERR_CODE = '\ufffd';
    const isArray = Array.isArray ||
        function (obj) {
            Object.prototype.toString.call(obj) == '[object Array]';
        };
    const hasArrayBuffer = typeof ArrayBuffer === 'function';
    const MyArrayBuffer = hasArrayBuffer ? ArrayBuffer : function () { };
    const myUint8arrayClass = hasArrayBuffer ? Uint8Array : Array;
    const getUint8Array = hasArrayBuffer
        ? function (arr) {
            return new Uint8Array(arr);
        }
        : function (arr) {
            return typeof arr === 'number' ? new Array(arr) : arr;
        };
    function u2utf8(codePoint) {
        if (codePoint < 0x80)
            return [codePoint];
        let n = 11;
        while (codePoint >= Math.pow(2, n)) {
            n += 5;
        }
        let length = Math.ceil(n / 6);
        let u8 = new Array(length);
        let i = 0;
        u8[0] = (0xff ^ (Math.pow(2, (8 - length)) - 1)) | (codePoint >> (6 * (length - 1)));
        while (i < length - 1) {
            u8[length - 1 - i] = 0x80 | ((codePoint >> (i * 6)) & 0x3f);
            i++;
        }
        return u8;
    }
    function utf8Encode(str) {
        let utf8 = [];
        let codePoints = [];
        for (let i = 0; i < str.length; i++) {
            let code = str.charCodeAt(i);
            let cod1;
            if (code < 0xd800 || code > 0xdfff) {
                codePoints.push(code);
            }
            else if (code < 0xdc00 && (cod1 = str.charCodeAt(i + 1)) >= 0xdc00 && cod1 < 0xe000) {
                i++;
                codePoints.push(0x10000 + (((code & 0x3ff) << 10) | (cod1 & 0x3ff)));
            }
            else {
                codePoints.push(code);
            }
        }
        for (let i = 0; i < codePoints.length; i++) {
            let v = codePoints[i];
            utf8.push.apply(utf8, u2utf8(v));
        }
        return getUint8Array(utf8);
    }
    function utf8Decode(buffer) {
        let u8;
        let str = '';
        let index = 0;
        if (buffer instanceof myUint8arrayClass) {
            u8 = buffer;
        }
        else if (buffer instanceof MyArrayBuffer || isArray(buffer)) {
            u8 = getUint8Array(buffer);
        }
        else {
            return String(buffer);
        }
        function setChar(i) {
            let _i = i;
            let c0 = u8[_i++];
            try {
                if (c0 < 0x80) {
                    str += String.fromCharCode(c0);
                    return _i;
                }
                else if (c0 < 0xc2 || c0 > 0xfd) {
                    throw 'code err';
                }
                else {
                    let mk = 0x80;
                    let w = 6;
                    let cs = [];
                    let code = 0;
                    while (c0 >= (mk | (Math.pow(2, w)))) {
                        let cn = u8[_i++];
                        if ((cn & 0xc0) ^ 0x80)
                            throw 'code err';
                        cs.push(cn);
                        mk = mk | (Math.pow(2, w));
                        w--;
                    }
                    cs = cs.reverse();
                    for (let k = 0; k < cs.length; k++) {
                        let _c = cs[k] & 0x3f;
                        code |= _c << (k * 6);
                    }
                    code |= (c0 & (Math.pow(2, w) - 1)) << (cs.length * 6);
                    if (code > 0xffff) {
                        let _code = code - 0x10000;
                        str += String.fromCharCode(0xd800 | (_code >> 10));
                        str += String.fromCharCode(0xdc00 | (_code & 0x3ff));
                    }
                    else {
                        str += String.fromCharCode(code & 0xffff);
                    }
                    return _i;
                }
            }
            catch (e) {
                str += ERR_CODE;
                return i + 1;
            }
        }
        while (index < u8.length) {
            index = setChar(index);
        }
        return str;
    }
    function toStringUTF8() {
        return utf8Decode(this);
    }
    function getEncode(table, pad) {
        return function (u8arr) {
            let _u8arr;
            if (u8arr instanceof myUint8arrayClass) {
                _u8arr = u8arr;
            }
            else if (u8arr instanceof MyArrayBuffer || isArray(u8arr)) {
                _u8arr = getUint8Array(u8arr);
            }
            else {
                _u8arr = utf8Encode(u8arr.toString());
            }
            let bitLength = Math.ceil((_u8arr.length * 8) / 6);
            let str64Length = Math.ceil(_u8arr.length / 3) * 4;
            let codes = new Array(str64Length);
            let index = 0;
            for (let i = 0; i < _u8arr.length;) {
                let a0 = _u8arr[i++];
                let a1 = _u8arr[i++];
                let a2 = _u8arr[i++];
                codes[index++] = a0 >> 2;
                codes[index++] = ((a0 << 4) | (a1 >> 4)) & 0x3f;
                codes[index++] = ((a1 << 2) | (a2 >> 6)) & 0x3f;
                codes[index++] = a2 & 0x3f;
            }
            let base64 = '';
            for (let i = 0; i < codes.length; i++) {
                const code = codes[i];
                base64 += i > bitLength - 1 ? pad : table[code];
            }
            return base64;
        };
    }
    function getDecode(table, pad) {
        const tableStr = table.join('');
        const getV = function (char) {
            let index = tableStr.indexOf(char);
            if (index == -1)
                throw new TypeError(`"${char}" not base64 char`);
            return index;
        };
        const getPads = function (base64Str) {
            let index = base64Str.length;
            let pads = 0;
            while (index-- > 0 && base64Str.charAt(index) === pad) {
                pads++;
            }
            return pads;
        };
        return function (base64Str) {
            let length = base64Str.length;
            let indexMax = length - getPads(base64Str);
            let mc4 = indexMax % 4;
            if (mc4 === 1)
                throw new TypeError('The parameter is not a base64 string!');
            let buffer = new myUint8arrayClass(Math.floor((indexMax * 6) / 8));
            let index = 0;
            let i = 0;
            const next = function () {
                return getV(base64Str.charAt(i++));
            };
            for (let loopLength = indexMax - mc4; i < loopLength;) {
                let [c0, c1, c2, c3] = [next(), next(), next(), next()];
                buffer[index++] = ((c0 << 2) | (c1 >> 4)) & 0xff;
                buffer[index++] = ((c1 << 4) | (c2 >> 2)) & 0xff;
                buffer[index++] = ((c2 << 6) | c3) & 0xff;
            }
            if (mc4) {
                let c1;
                buffer[index++] = ((next() << 2) | ((c1 = next()) >> 4)) & 0xff;
                if (mc4 === 3) {
                    buffer[index++] = ((c1 << 4) | (next() >> 2)) & 0xff;
                }
            }
            buffer.toString = toStringUTF8;
            return buffer;
        };
    }
    const encode = getEncode(BASE64_TABLE, PAD);
    const decode = getDecode(BASE64_TABLE, PAD);
    const decodeURL = getDecode(BASE64_URL_TABLE, PAD);

    /*!
     * bitmatrix  v0.5.0
     * Homepage https://github.com/cnwhy/BitMatrix
     * License ISC
     */

    const isInteger = Number.isInteger;

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
            if (!isInteger(width) || !isInteger(height))
                throw RangeError('width and height must be an integer');
            if (width < 0 || height < 0)
                throw RangeError('width and height must be greater than 0');
            Object.defineProperty(this, 'width', { value: width });
            Object.defineProperty(this, 'height', { value: height });
            Object.defineProperty(this, 'total', { value: width * height });
        }
        Validator_row(row) {
            if (!isInteger(row))
                throw TypeError('row must be an integer');
            if (row < 0 || row >= this.height)
                throw RangeError('Parameter "row" is out of range');
        }
        Validator_column(column) {
            if (!isInteger(column))
                throw TypeError('column must be an integer');
            if (column < 0 || column >= this.width)
                throw RangeError('Parameter "column" is out of range');
        }
        Validator_xy(x, y) {
            if (!isInteger(x) || !isInteger(y))
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
                    if (!isInteger(width))
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
            let barray = decode(base64);
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
                matrix._data = JSON.parse(utf8Decode(barray.buffer.slice(9)));
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
            return encode(baseBuffer) + encode(data);
        }
        output() {
            return Matrix.output(this);
        }
    }

    function Bit2Array(byte, start = 0, end) {
        let arr = [];
        let v = byte >> start;
        end = end && end < 8 ? end : 8;
        for (let i = start; i < end; i++) {
            arr.push(v & 1 ? 1 : 0);
            v >>= 1;
        }
        return arr;
    }
    function ArraySetBit(byte, arr, start = 0, end) {
        end = end && end < 8 ? end : 8;
        let index = start, i = 0;
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
    class BitMatrix extends Matrix {
        constructor(width, height, defaultValue = 0) {
            super(width, height);
            this._data = new Uint8Array(Math.ceil((width * height) / 8));
            if (defaultValue) {
                this._data.fill(255);
            }
        }
        clone() {
            return Object.create(this, {
                _data: Object.assign(Object.getOwnPropertyDescriptor(this, '_data'), {
                    value: new Uint8Array(this._data.buffer.slice(0))
                })
            });
        }
        getPrototypeData() {
            return this._data;
        }
        fill(value) {
            this._data.fill(!!value ? 255 : 0);
        }
        fillRow(row, value) {
            this.Validator_row(row);
            let { width, height, _data, total } = this;
            let start = this.getIndex(0, row);
            let end = this.getIndex(width - 1, row);
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
            for (let index = start.index + 1; index < end.index; index++) {
                _data[index] = value ? 0xff : 0;
            }
        }
        fillColumn(column, v) {
            this.Validator_column(column);
            let { width, height, _data, total } = this;
            let set = (function () {
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
            for (let h = 0; h < height; h++) {
                let { index, offset } = this.getIndex(column, h);
                set(index, offset);
            }
        }
        get(x, y) {
            let { index, offset } = this.getIndex(x, y);
            return (this._data[index] >> offset) & 1;
        }
        set(x, y, v) {
            let { index, offset } = this.getIndex(x, y);
            if (v) {
                this._data[index] |= 1 << offset;
            }
            else {
                this._data[index] &= ~(1 << offset);
            }
        }
        getRow(row) {
            let { width, height, _data } = this;
            let start = this.getIndex(0, row);
            let end = this.getIndex(width - 1, row);
            if (start.index === end.index) {
                return Bit2Array(_data[start.index], start.offset, end.offset + 1);
            }
            let arr = Bit2Array(_data[start.index], start.offset);
            for (let index = start.index + 1; index < end.index; index++) {
                arr = arr.concat(Bit2Array(_data[index]));
            }
            arr = arr.concat(Bit2Array(_data[end.index], 0, end.offset + 1));
            return arr;
        }
        setRow(row, value) {
            let { width, height, _data, total } = this;
            let start = this.getIndex(0, row);
            let end = this.getIndex(width - 1, row);
            let i = 0;
            if (start.index === end.index) {
                _data[start.index] = ArraySetBit(_data[start.index], value, start.offset, start.offset + width);
                return;
            }
            _data[start.index] = ArraySetBit(_data[start.index], value, start.offset);
            i = 8 - start.offset;
            for (let index = start.index + 1; index < end.index && i < value.length; index++) {
                let byte = _data[index];
                _data[index] = ArraySetBit(byte, value.slice(i));
                i += 8;
            }
            if (i >= value.length)
                return;
            _data[end.index] = ArraySetBit(_data[end.index], value.slice(i), 0, end.offset + 1);
        }
        getColumn(column) {
            this.Validator_column(column);
            let { height } = this;
            let arr = [];
            let h = 0;
            while (h < height) {
                arr.push(this.get(column, h++));
            }
            return arr;
        }
        setColumn(column, value) {
            this.Validator_column(column);
            let { height } = this;
            let i = 0;
            while (i < value.length && i < height) {
                this.set(column, i, value[i++]);
            }
        }
        cellForEach(fn) {
            let { width, height, total: length, _data: byteArray } = this;
            let x = 0, y = 0;
            let blength = byteArray.length;
            for (let i = 0; i < blength; i++) {
                let v = byteArray[i];
                for (let b = 0; b < 8; b++) {
                    fn((v >> b) & 1, x, y);
                    if (++x >= width) {
                        x = 0;
                        y++;
                        if (y >= height)
                            return;
                    }
                }
            }
        }
        getIndex(x, y) {
            this.Validator_xy(x, y);
            let n = y * this.width + x + 1;
            return {
                index: Math.ceil(n / 8) - 1,
                offset: (n - 1) % 8
            };
        }
    }

    class AnyMatrix extends Matrix {
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
        getPrototypeData() {
            return this._data;
        }
        clone() {
            return Object.create(this, {
                _data: Object.assign(Object.getOwnPropertyDescriptor(this, '_data'), {
                    value: this._data.slice(0)
                })
            });
        }
        fill(value) {
            this._data.fill(value);
        }
        fillRow(row, value) {
            this.Validator_row(row);
            let { width, _data } = this;
            let index = width * row;
            while (width--) {
                _data[index++] = value;
            }
        }
        fillColumn(column, v) {
            this.Validator_column(column);
            let { width, _data, total } = this;
            let index = column;
            while (index < total) {
                _data[index] = v;
                index += width;
            }
        }
        get(x, y) {
            this.Validator_xy(x, y);
            return this._data[y * this.width + x];
        }
        set(x, y, v) {
            this.Validator_xy(x, y);
            this._data[y * this.width + x] = v;
        }
        getRow(row) {
            this.Validator_row(row);
            let { width, _data } = this;
            let start = width * row;
            return Array.prototype.slice.call(_data, start, start + width);
        }
        setRow(row, value) {
            this.Validator_row(row);
            let { width, _data } = this;
            let index = width * row;
            let _end = width * (row + 1);
            let i = 0;
            while (i < value.length && index < _end) {
                _data[index++] = value[i++];
            }
        }
        getColumn(column) {
            this.Validator_column(column);
            let { width, _data, total } = this;
            let arr = [];
            let index = column;
            while (index < total) {
                arr.push(_data[index]);
                index += width;
            }
            return arr;
        }
        setColumn(column, value) {
            this.Validator_column(column);
            let { width, _data, total } = this;
            let index = column;
            let i = 0;
            while (i < value.length && index < total) {
                _data[index] = value[i++];
                index += width;
            }
        }
        cellForEach(fn) {
            let { _data, width, total } = this;
            let x = 0;
            let y = 0;
            for (let i = 0; i < total; i++) {
                fn(_data[i], x, y);
                if (++x == width) {
                    x = 0;
                    y++;
                }
            }
        }
    }

    class AnyMatrixUseObject extends Matrix {
        constructor(width, height, defaultValue) {
            super(width, height);
            let data = (this._data = {});
            if (defaultValue !== undefined) {
                this.fill(defaultValue);
            }
        }
        clone() {
            return Object.create(this, {
                _data: Object.assign(Object.getOwnPropertyDescriptor(this, '_data'), {
                    value: Object.assign({}, this._data)
                })
            });
        }
        getPrototypeData() {
            return this._data;
        }
        fill(v) {
            let data = this._data;
            let max = this.total;
            while (max--) {
                data[max] = v;
            }
        }
        fillRow(row, value) {
            this.Validator_row(row);
            let { width, _data } = this;
            let index = width * row;
            while (width--) {
                _data[index++] = value;
            }
        }
        fillColumn(column, v) {
            this.Validator_column(column);
            let { width, _data, total } = this;
            let index = column;
            while (index < total) {
                _data[index] = v;
                index += width;
            }
        }
        get(x, y) {
            this.Validator_xy(x, y);
            return this._data[y * this.width + x];
        }
        set(x, y, v) {
            this.Validator_xy(x, y);
            this._data[y * this.width + x] = v;
        }
        getRow(row) {
            this.Validator_row(row);
            let { width, _data } = this;
            let index = width * row;
            let arr = [];
            while (width--) {
                arr.push(_data[index++]);
            }
            return arr;
        }
        setRow(row, value) {
            this.Validator_row(row);
            let { width, height, _data } = this;
            let index = width * row;
            let _end = width * (row + 1);
            let i = 0;
            while (i < value.length && index < _end) {
                _data[index++] = value[i++];
            }
        }
        getColumn(column) {
            this.Validator_column(column);
            let { width, _data, total } = this;
            let arr = [];
            let index = column;
            while (index < total) {
                arr.push(_data[index]);
                index += width;
            }
            return arr;
        }
        setColumn(column, value) {
            this.Validator_column(column);
            let { width, _data, total } = this;
            let index = column;
            let i = 0;
            while (i < value.length && index < total) {
                _data[index] = value[i++];
                index += width;
            }
        }
        cellForEach(fn) {
            let { _data, width, total } = this;
            let x = 0;
            let y = 0;
            for (let i = 0; i < total; i++) {
                fn(_data[i], x, y);
                if (++x >= width) {
                    x = 0;
                    y++;
                }
            }
        }
    }

    function getTypedMatrixClass(TypedArrayClass) {
        var _a;
        let name = TypedArrayClass.name.replace('Array', 'Matrix');
        return _a = class extends AnyMatrix {
                constructor(width, height, defaultValue = 0) {
                    super(width, height, defaultValue);
                }
                _dataInit() {
                    this._data = new TypedArrayClass(this.total);
                }
                clone() {
                    return Object.create(this, {
                        _data: Object.assign(Object.getOwnPropertyDescriptor(this, '_data'), {
                            value: new TypedArrayClass(this._data.buffer.slice(0))
                        })
                    });
                }
            },
            _a.className = name,
            _a;
    }

    const Int8Matrix = getTypedMatrixClass(Int8Array);
    const Uint8Matrix = getTypedMatrixClass(Uint8Array);
    const Uint8ClampedMatrix = getTypedMatrixClass(Uint8ClampedArray);
    const Int16Matrix = getTypedMatrixClass(Int16Array);
    const Uint16Matrix = getTypedMatrixClass(Uint16Array);
    const Int32Matrix = getTypedMatrixClass(Int32Array);
    const Uint32Matrix = getTypedMatrixClass(Uint32Array);
    const Float32Matrix = getTypedMatrixClass(Float32Array);
    const Float64Matrix = getTypedMatrixClass(Float64Array);

    exports.AnyMatrix = AnyMatrix;
    exports.AnyMatrixUseObject = AnyMatrixUseObject;
    exports.BitMatrix = BitMatrix;
    exports.ByteMatrix = Uint8Matrix;
    exports.Float32Matrix = Float32Matrix;
    exports.Float64Matrix = Float64Matrix;
    exports.Int16Matrix = Int16Matrix;
    exports.Int32Matrix = Int32Matrix;
    exports.Int8Matrix = Int8Matrix;
    exports.Uint16Matrix = Uint16Matrix;
    exports.Uint32Matrix = Uint32Matrix;
    exports.Uint8ClampedMatrix = Uint8ClampedMatrix;
    exports.Uint8Matrix = Uint8Matrix;
    exports.default = BitMatrix;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
