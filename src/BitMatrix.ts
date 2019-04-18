import Matrix from './Matrix';
import { encode as b64Encode, decode as b46Decode } from './Base64';

function Bit2Array(byte: number, start: number = 0, end?: number) {
	let arr = [];
	let v = byte >> start;
	end = end && end < 8 ? end : 8;
	for (let i = start; i < end; i++) {
		arr.push(v & 1 ? 1 : 0);
		v >>= 1;
	}
	return arr;
}
function ArraySetBit(byte: number, arr: any[], start = 0, end?: number) {
	end = end && end < 8 ? end : 8;
	let index = start,
		i = 0;
	while (index < end && i < arr.length) {
		if (arr[i]) {
			byte |= 1 << index;
		} else {
			byte &= ~(1 << index);
		}
		i++, index++;
	}
	return byte;
	// for(let i = start; i< end; i++){
	// 	if(_arr)
	// }
}

class BitMatrix extends Matrix {
	// protected _data: ArrayBuffer;
	protected _data: Uint8Array;
	constructor(width: number, height: number, defaultValue = 0) {
		super(width, height);
		// this.data = new ArrayBuffer(Math.ceil((width * height) / 8));
		// this.byteArray = new Uint8Array(this.data);
		this._data = new Uint8Array(Math.ceil((width * height) / 8));
		if (defaultValue) {
			this._data.fill(255);
		}
	}
	clone(): BitMatrix {
		return Object.create(this, {
			_data: Object.assign(Object.getOwnPropertyDescriptor(this, '_data'), {
				value: new Uint8Array(this._data.buffer.slice(0))
			})
		});
	}
	getPrototypeData(): Uint8Array {
		return this._data;
	}
	fill(value: boolean | number): void {
		this._data.fill(!!value ? 255 : 0);
	}
	fillRow(row: number, value: boolean | number) {
		this.Validator_row(row);
		let { width, height, _data, total } = this;
		let start = this.getIndex(0, row);
		let end = this.getIndex(width - 1, row);
		if (start.index === end.index) {
			// return Bit2Array(_data[start.index], start.offset, end.offset + 1);
			if (value) {
				_data[start.index] |= (2 ** width - 1) << start.offset;
			} else {
				_data[start.index] &=
					((2 ** start.offset - 1) << (8 - start.offset)) | (2 ** (8 - end.offset - 1) - 1);
			}
			return;
		}
		if (value) {
			_data[start.index] |= 0xff << start.offset;
			_data[end.index] |= 0xff >> (7 - end.offset);
		} else {
			_data[start.index] &= 0xff >> (8 - start.offset);
			_data[end.index] &= 0xff << (end.offset + 1);
		}
		for (let index = start.index + 1; index < end.index; index++) {
			_data[index] = value ? 0xff : 0;
		}
	}
	fillColumn(column: number, v: any) {
		this.Validator_column(column);
		let { width, height, _data, total } = this;
		let set = (function() {
			if (v) {
				return function(i, offset) {
					_data[i] |= 1 << offset;
				};
			} else {
				return function(i, offset) {
					_data[i] &= ~(1 << offset);
				};
			}
		})();
		for (let h = 0; h < height; h++) {
			let { index, offset } = this.getIndex(column, h);
			set(index, offset);
		}
	}
	get(x: number, y: number): number {
		let { index, offset } = this.getIndex(x, y);
		return (this._data[index] >> offset) & 1;
	}
	set(x: number, y: number, v: any): void {
		let { index, offset } = this.getIndex(x, y);
		if (v) {
			this._data[index] |= 1 << offset;
		} else {
			this._data[index] &= ~(1 << offset);
		}
	}
	getRow(row: number): any[] {
		let { width, height, _data } = this;
		let start = this.getIndex(0, row);
		let end = this.getIndex(width - 1, row);
		//width <= 8时可能出现
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
	setRow(row: number, value: any[]) {
		let { width, height, _data, total } = this;
		let start = this.getIndex(0, row);
		let end = this.getIndex(width - 1, row);
		let i = 0;
		_data[start.index] = ArraySetBit(_data[start.index], value, start.offset);
		i = 8 - start.offset;
		for (let index = start.index + 1; index < end.index && i < value.length; index++) {
			let byte = _data[index];
			_data[index] = ArraySetBit(byte, value.slice(i));
			i += 8;
		}
		if (i >= value.length) return;
		_data[end.index] = ArraySetBit(_data[end.index], value.slice(i), 0, end.offset + 1);
	}
	getColumn(column: number): any[] {
		this.Validator_column(column);
		let { height } = this;
		let arr = [];
		let h = 0;
		while (h < height) {
			arr.push(this.get(column, h++));
		}
		return arr;
	}
	setColumn(column: number, value: any[]) {
		this.Validator_column(column);
		let { height } = this;
		let h = 0;
		let i = 0;
		while (i < value.length && h < height) {
			this.set(column, i, value[i++]);
		}
	}
	cellForEach(fn: (v: number, x: number, y: number) => void) {
		let { width, height, total: length, _data: byteArray } = this;
		// let n = 0;
		let x = 0,
			y = 0;
		let blength = byteArray.length;
		for (let i = 0; i < blength; i++) {
			let v = byteArray[i];
			for (let b = 0; b < 8; b++) {
				// let [_x,_y] = this.getPosition(n);
				// fn(!!((v >> b) & 1),_x,_y);
				// fn.apply(null, [!!((v >> b) & 1)]);
				fn((v >> b) & 1, x, y);
				if (++x >= width) {
					x = 0;
					y++;
					if (y >= height) return;
				}
				// if (++n >= length) return;
			}
		}
	}
	// rowForEach(fn: (v: boolean[], y: number) => void) {
	// 	return [];
	// }
	// columnForEach(fn: (v: boolean[], x: number) => void) {
	// 	return [];
	// }
	private getIndex(x: number, y: number): { index: number; offset: number } {
		this.Validator_xy(x, y);
		let n = y * this.width + x + 1;
		return {
			index: Math.ceil(n / 8) - 1,
			// offset: (8 - n % 8) % 8   //01234567,89abcdef
			offset: (n - 1) % 8 //76543210,fedcba98
		};
	}
	/**
	 * 创建一个类
	 *
	 * @static
	 * @param {any[]} arrayLike
	 * @memberof BitMatrix
	 */
	// static from(arrayLike:any[][]): Matrix;
	// static from(arrayLike:any[],width:number): Matrix;//arrayLike[, mapFn[, thisArg]
	// static from(arrayLike:any[],width?:number){//arrayLike[, mapFn[, thisArg]
	// 	return Matrix.from.call(this,arrayLike,width);
	// }
	// private getPosition(a: number): number[];
	// private getPosition(a: number, b: number): number[];
	// private getPosition(index: number, offset?: number): number[] {
	// 	let n = offset == undefined ? index + 1 : index * 8 + offset + 1;
	// 	return [(n - 1) % this.width, Math.ceil(n / this.width) - 1];
	// }

}
export default BitMatrix;
