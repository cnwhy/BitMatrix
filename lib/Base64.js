"use strict";
exports.__esModule = true;
var table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
var noCode = '\ufffd';
var getV = function (char) {
    if (char == '=')
        return 0;
    var index = table.indexOf(char);
    if (index == -1)
        throw new Error("\"" + char + "\" not base64 char");
    return index;
};
function isTypeArray(obj) {
    return (obj &&
        obj.buffer instanceof ArrayBuffer &&
        typeof obj.byteOffset === 'number' &&
        typeof obj.byteLength === 'number');
}
function typeArray2Uint8Array(obj) {
    if (obj instanceof Uint8Array) {
        return obj;
    }
    else {
        return new Uint8Array(obj.buffer, obj.byteOffset, obj.byteLength);
    }
}
function u2utf8(codePoint) {
    if (codePoint < 0x80) {
        return new Uint8Array([codePoint]);
    }
    if (codePoint > 0x7fffffff)
        throw new SyntaxError('Undefined Unicode code-point');
    var n = 11;
    while (codePoint >= Math.pow(2, n)) {
        n += 5;
    }
    var length = Math.ceil(n / 6);
    var u8 = new Uint8Array(length);
    var i = 0;
    u8[0] = (0xff ^ (Math.pow(2, (8 - length)) - 1)) | (codePoint >> (6 * (length - 1)));
    while (i < length - 1) {
        u8[length - 1 - i] = 0x80 | ((codePoint >> (i * 6)) & 0x3f);
        i++;
    }
    return u8;
}
function utf8Encode(str) {
    var utf8 = [];
    var codePoints = [];
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        var cod1 = void 0;
        if (code < 0xd800) {
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
    codePoints.forEach(function (v) {
        utf8.push.apply(utf8, Array.from(u2utf8(v)));
    });
    return new Uint8Array(utf8);
}
exports.utf8Encode = utf8Encode;
function utf8Decode(buffer) {
    var u8;
    if (isTypeArray(buffer)) {
        u8 = typeArray2Uint8Array(buffer);
    }
    else if (buffer instanceof ArrayBuffer || Array.isArray(buffer)) {
        u8 = new Uint8Array(buffer);
    }
    else {
        return '';
    }
    var str = '';
    function setChar(i) {
        var _i = i;
        var c0 = u8[_i++];
        try {
            if (c0 < 0x80) {
                str += String.fromCharCode(c0);
                return _i;
            }
            else if (c0 < 0xc2) {
                throw 'code err';
            }
            else {
                var mk = 0xc0;
                var w = 5;
                var cs = [u8[_i++]];
                var code = 0;
                while (c0 >= (mk | (Math.pow(2, w)))) {
                    cs.push(u8[_i++]);
                    mk = mk | (Math.pow(2, w));
                    w--;
                }
                if (w < 1)
                    throw 'code err';
                cs = cs.reverse();
                for (var k = 0; k < cs.length; k++) {
                    var _c = cs[k] & 0x3f;
                    code |= _c << (k * 6);
                }
                code |= (c0 & (Math.pow(2, w) - 1)) << (cs.length * 6);
                if (code > 0x10000) {
                    var _code = code - 0x10000;
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
            str += String.fromCharCode(c0);
            return i + 1;
        }
    }
    var index = 0;
    while (index < u8.length) {
        index = setChar(index);
    }
    return str;
}
exports.utf8Decode = utf8Decode;
function encode(u8arr) {
    var _u8arr;
    if (isTypeArray(u8arr)) {
        _u8arr = typeArray2Uint8Array(u8arr);
    }
    else if (u8arr instanceof ArrayBuffer || Array.isArray(u8arr)) {
        _u8arr = new Uint8Array(u8arr);
    }
    else {
        _u8arr = utf8Encode(u8arr.toString());
    }
    var bitLength = Math.ceil((_u8arr.length * 8) / 6);
    var str64Length = Math.ceil(_u8arr.length / 3) * 4;
    var codes = new Uint8Array(str64Length);
    var index = 0;
    for (var i = 0; i < _u8arr.length;) {
        var a0 = _u8arr[i++];
        var a1 = _u8arr[i++];
        var a2 = _u8arr[i++];
        codes[index++] = a0 >> 2;
        codes[index++] = ((a0 << 4) | (a1 >> 4)) & 63;
        codes[index++] = ((a1 << 2) | (a2 >> 6)) & 63;
        codes[index++] = a2 & 63;
    }
    return codes.reduce(function (d, code, i) {
        return (d += i > bitLength - 1 ? '=' : table[code]);
    }, '');
}
exports.encode = encode;
function decode(base64Str) {
    base64Str = base64Str.trim();
    var _str64 = base64Str.replace(/=*$/, '');
    var mc4 = _str64.length % 4;
    if (mc4 === 1)
        throw new TypeError('传入的参数不是有效的base64字符串');
    var bitLength = Math.floor((_str64.length * 6) / 8);
    _str64 += mc4 ? (mc4 === 2 ? 'AA' : 'A') : '';
    var buffer = new Uint8Array(bitLength);
    var index = 0;
    for (var i = 0; i < base64Str.length;) {
        var c0 = getV(base64Str.charAt(i++));
        var c1 = getV(base64Str.charAt(i++));
        var c2 = getV(base64Str.charAt(i++));
        var c3 = getV(base64Str.charAt(i++));
        buffer[index++] = (c0 << 2) | (c1 >> 4);
        buffer[index++] = (c1 << 4) | (c2 >> 2);
        buffer[index++] = (c2 << 6) | c3;
    }
    return buffer;
}
exports.decode = decode;
