const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');
const mend = '=';

/**
 * Unicode Utf8 编码
 *
 * @param {number} codePoint Unicode 码点
 * @returns {Uint8Array} 返回字节数据
 */
function u2utf8(codePoint: number): Uint8Array {
	if (codePoint < 0x80) {
		return new Uint8Array([codePoint]);
	}
	if (codePoint > 0x7fffffff) throw new SyntaxError('Undefined Unicode code-point');
	let n = 11;
	while (codePoint > 2 ** n) {
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

function u2utf16(codePoint: number): Uint8Array {
	if (codePoint > 0x10ffff) throw new SyntaxError('Undefined Unicode code-point');
	if (codePoint < 0x10000) {
		return new Uint8Array(new Uint16Array([codePoint]).buffer);
	} else {
		let _code = codePoint - 0x10000;
		return new Uint8Array(new Uint16Array([0xd800 | (_code >> 10), 0xdc00 | (_code & 0x3ff)]).buffer);
	}
}

function utf8Encode(str) {
	var utf8 = [];
	for (var i = 0; i < str.length; i++) {
		var charcode = str.charCodeAt(i);
		if (charcode < 0x80) {
			utf8.push(charcode);
		} else if (charcode < 0x800) {
			utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
		} else if (charcode < 0xd800 || charcode >= 0xe000) {
			utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
		}
		// surrogate pair (4字节字符)
		else {
			i++;
			// UTF-16 encodes 0x10000-0x10FFFF by
			// subtracting 0x10000 and splitting the
			// 20 bits of 0x0-0xFFFFF into two halves
			charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
			utf8.push(
				0xf0 | (charcode >> 18),
				0x80 | ((charcode >> 12) & 0x3f),
				0x80 | ((charcode >> 6) & 0x3f),
				0x80 | (charcode & 0x3f)
			);
		}
	}
	return new Uint8Array(utf8);
}

const noCode = '\ufffd';
function utf8Decode(buffer: ArrayBuffer | Uint8Array): string {
	let dv: Uint8Array;
	if (buffer instanceof ArrayBuffer) {
		dv = new Uint8Array(buffer);
	} else if (buffer.buffer instanceof ArrayBuffer) {
		dv = new Uint8Array(buffer.buffer);
	} else if (Array.isArray(buffer)) {
		dv = new Uint8Array(buffer);
	} else {
		return '';
	}
	let str = '';
	function setChar(i): number {
		let _i = i;
		let c0 = dv[_i++];
		try {
			if (c0 < 0x80) {
				str += String.fromCharCode(c0);
				return _i;
			} else if (c0 < 0xc2) {
				//  最小双字节 `u+0080` 转第一位最小值是 1100 0010 , 0000 0000
				// str += noCode;
				throw 'code err';
			} else {
				let mk = 0xc0;
				let w = 5;
				let cs = [dv[_i++]];
				let code = 0;
				while (c0 >= (mk | (2 ** w))) {
					cs.push(dv[_i++]);
					mk = mk | (2 ** w);
					w--;
				}
				if (w < 1) throw 'code err';
				cs = cs.reverse();
				for (let k = 0; k < cs.length; k++) {
					let _c = cs[i] & 0x3f;
					code |= _c << (k * 6);
				}
				code |= (c0 & (2 ** w - 1)) << (cs.length * 6);
				console.log(code);
				if (code > 0x10000) {
					str += String.fromCharCode(code >> 16);
				}
				str += String.fromCharCode(code & 0xffff);
				return _i;
			}
		} catch (e) {
			str += noCode;
			return i++;
		}
	}
	let index = 0;
	while (index < dv.length) {
		index = setChar(index);
	}
	return str;
}

function ucs2Encode(str: string) {
	let buffer = new Uint16Array(str.length);
	for (var i = 0; i < str.length; i++) {
		buffer[i] = str.charCodeAt(i);
	}
	return new Uint8Array(buffer.buffer);
}

function ucs2Decode(u8arr: ArrayBuffer | Uint8Array) {
	let u16: { length: number };
	if (u8arr instanceof ArrayBuffer) {
		u16 = new Uint16Array(u8arr);
	} else if (u8arr.buffer instanceof ArrayBuffer) {
		u16 = new Uint16Array(u8arr.buffer);
	} else if (Array.isArray(u8arr)) {
		u16 = new Uint16Array(new Uint8Array(u8arr).buffer);
	} else {
		return '';
	}
	let str = '';
	for (let i = 0; i < u16.length; i++) {
		str += String.fromCharCode(u16[i]);
	}
	return str;
}

function encode(u8arr: ArrayBuffer | Uint8Array | string):string {
	let _u8arr: { length: number };
	if (u8arr instanceof ArrayBuffer) {
		_u8arr = new Uint8Array(u8arr);
	} else if (u8arr['buffer'] && u8arr['buffer'] instanceof ArrayBuffer) {
		_u8arr = new Uint8Array(u8arr['buffer']);
	} else if (Array.isArray(u8arr)) {
		_u8arr = new Uint8Array(new Uint8Array(u8arr).buffer);
	}else if(typeof u8arr === 'string'){
		_u8arr = utf8Encode(u8arr);
	}else if(Array.isArray(u8arr)){
		_u8arr = new Uint8Array(u8arr)
	} else {
		return '';
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
	if (base64Str.length % 4) throw new TypeError('传入的参数不是有效的base64字符串');
	base64Str = base64Str.replace(/=*$/, '');
	let bitLength = Math.floor((base64Str.length * 6) / 8);
	let buffer = new Uint8Array(bitLength);
	let index = 0;
	for (let i = 0; i < base64Str.length; ) {
		let c0 = table.indexOf(base64Str.charAt(i++));
		let c1 = table.indexOf(base64Str.charAt(i++));
		let c2 = table.indexOf(base64Str.charAt(i++));
		let c3 = table.indexOf(base64Str.charAt(i++));
		buffer[index++] = (c0 << 2) | (c1 >> 4);
		buffer[index++] = (c1 << 4) | (c2 >> 2);
		buffer[index++] = (c2 << 6) | c3;
	}
	return buffer;
}

export { decode, encode , utf8Encode, utf8Decode};
