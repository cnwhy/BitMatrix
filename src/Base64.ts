const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
const noCode = '\ufffd';
const getV = function(char): number {
	if (char == '=') return 0;
	let index = table.indexOf(char);
	if (index == -1) throw new Error(`"${char}" not base64 char`);
	return index;
};
function isTypeArray(obj) {
	return (
		obj &&
		obj.buffer instanceof ArrayBuffer &&
		typeof obj.byteOffset === 'number' &&
		typeof obj.byteLength === 'number'
	);
}

function typeArray2Uint8Array(obj) {
	if (obj instanceof Uint8Array) {
		return obj;
	} else {
		return new Uint8Array(obj.buffer, obj.byteOffset, obj.byteLength);
	}
}

function u2utf8(codePoint: number): Uint8Array {
	if (codePoint < 0x80) {
		return new Uint8Array([codePoint]);
	}
	if (codePoint > 0x7fffffff) throw new SyntaxError('Undefined Unicode code-point');
	let n = 11;
	while (codePoint >= 2 ** n) {
		n += 5;
	}
	let length = Math.ceil(n / 6);
	let u8 = new Uint8Array(length);
	let i = 0;
	u8[0] = (0xff ^ (2 ** (8 - length) - 1)) | (codePoint >> (6 * (length - 1)));
	while (i < length - 1) {
		u8[length - 1 - i] = 0x80 | ((codePoint >> (i * 6)) & 0x3f);
		i++;
	}
	return u8;
}

function utf8Encode(str) {
	let utf8 = [];
	let codePoints = [];
	for (var i = 0; i < str.length; i++) {
		let code = str.charCodeAt(i);
		let cod1;
		if (code < 0xd800) {
			codePoints.push(code);
		} else if (code < 0xdc00 && (cod1 = str.charCodeAt(i + 1)) >= 0xdc00 && cod1 < 0xe000) {
			i++;
			codePoints.push(0x10000 + (((code & 0x3ff) << 10) | (cod1 & 0x3ff)));
		} else {
			//编码不正常处理
			codePoints.push(code);
		}
	}
	codePoints.forEach(v => {
		utf8.push.apply(utf8, Array.from(u2utf8(v)));
	});
	// for (var i = 0; i < str.length; i++) {
	// 	var charcode = str.charCodeAt(i);
	// 	if (charcode < 0x80) {
	// 		utf8.push(charcode);
	// 	} else if (charcode < 0x800) {
	// 		utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
	// 	} else if (charcode < 0xd800 || charcode >= 0xe000) {
	// 		utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
	// 	}
	// 	// surrogate pair (4字节字符)
	// 	else {
	// 		i++;
	// 		// UTF-16 encodes 0x10000-0x10FFFF by
	// 		// subtracting 0x10000 and splitting the
	// 		// 20 bits of 0x0-0xFFFFF into two halves
	// 		charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
	// 		utf8.push(
	// 			0xf0 | (charcode >> 18),
	// 			0x80 | ((charcode >> 12) & 0x3f),
	// 			0x80 | ((charcode >> 6) & 0x3f),
	// 			0x80 | (charcode & 0x3f)
	// 		);
	// 	}
	// }
	return new Uint8Array(utf8);
}

function utf8Decode(buffer: ArrayBuffer | Uint8Array | number[]): string {
	let u8: Uint8Array;
	if (isTypeArray(buffer)) {
		u8 = typeArray2Uint8Array(buffer);
	} else if (buffer instanceof ArrayBuffer || Array.isArray(buffer)) {
		u8 = new Uint8Array(buffer);
	} else {
		return '';
	}
	let str = '';
	function setChar(i): number {
		let _i = i;
		let c0 = u8[_i++];
		try {
			if (c0 < 0x80) {
				str += String.fromCharCode(c0);
				return _i;
			} else if (c0 < 0xc2) {
				//  多字节 `u+0080` 转第一位最小值是 1100 0010 , 0000 0000
				throw 'code err';
			} else {
				let mk = 0xc0;
				let w = 5;
				let cs = [u8[_i++]];
				let code = 0;
				while (c0 >= (mk | (2 ** w))) {
					cs.push(u8[_i++]);
					mk = mk | (2 ** w);
					w--;
				}
				if (w < 1) throw 'code err';
				cs = cs.reverse();
				for (let k = 0; k < cs.length; k++) {
					let _c = cs[k] & 0x3f;
					code |= _c << (k * 6);
				}
				code |= (c0 & (2 ** w - 1)) << (cs.length * 6);
				if (code > 0x10000) {
					let _code = code - 0x10000;
					str += String.fromCharCode(0xd800 | (_code >> 10));
					str += String.fromCharCode(0xdc00 | (_code & 0x3ff));
				} else {
					str += String.fromCharCode(code & 0xffff);
				}
				return _i;
			}
		} catch (e) {
			str += String.fromCharCode(c0);
			return i + 1;
		}
	}
	let index = 0;
	while (index < u8.length) {
		index = setChar(index);
	}
	return str;
}

function encode(u8arr: ArrayBuffer | Uint8Array | number[] | string): string {
	let _u8arr: { length: number };
	if (isTypeArray(u8arr)) {
		_u8arr = typeArray2Uint8Array(u8arr);
	} else if (u8arr instanceof ArrayBuffer || Array.isArray(u8arr)) {
		_u8arr = new Uint8Array(u8arr);
	} else {
		_u8arr = utf8Encode(u8arr.toString());
	}
	let bitLength = Math.ceil((_u8arr.length * 8) / 6);
	let str64Length = Math.ceil(_u8arr.length / 3) * 4;
	let codes = new Uint8Array(str64Length);
	let index = 0;
	for (let i = 0; i < _u8arr.length; ) {
		let a0 = _u8arr[i++];
		let a1 = _u8arr[i++];
		let a2 = _u8arr[i++];
		codes[index++] = a0 >> 2;
		codes[index++] = ((a0 << 4) | (a1 >> 4)) & 63;
		codes[index++] = ((a1 << 2) | (a2 >> 6)) & 63;
		codes[index++] = a2 & 63;
	}
	return codes.reduce((d, code, i) => {
		return (d += i > bitLength - 1 ? '=' : table[code]);
	}, '');
}

/**
 * 将base64字符串解码为二进制数据
 *
 * @param {string} base64Str
 * @returns {Uint8Array}
 */
function decode(base64Str: string): Uint8Array {
	base64Str = base64Str.trim();
	let _str64 = base64Str.replace(/=*$/, '');
	let mc4 = _str64.length % 4;
	if (mc4 === 1) throw new TypeError('传入的参数不是有效的base64字符串');
	let bitLength = Math.floor((_str64.length * 6) / 8);
	_str64 += mc4 ? (mc4 === 2 ? 'AA' : 'A') : '';
	let buffer = new Uint8Array(bitLength);
	let index = 0;
	for (let i = 0; i < base64Str.length; ) {
		let c0 = getV(base64Str.charAt(i++));
		let c1 = getV(base64Str.charAt(i++));
		let c2 = getV(base64Str.charAt(i++));
		let c3 = getV(base64Str.charAt(i++));
		buffer[index++] = (c0 << 2) | (c1 >> 4);
		buffer[index++] = (c1 << 4) | (c2 >> 2);
		buffer[index++] = (c2 << 6) | c3;
	}
	return buffer;
}

export { decode, encode, utf8Encode, utf8Decode };
