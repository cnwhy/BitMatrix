import Matrix from './Matrix';
import { isInteger } from './Validator';

class AnyMatrixUseObject extends Matrix {
	protected _data: any;
	constructor(width: number, height: number, defaultValue?) {
		super(width, height);
		let data = (this._data = {});
		if (defaultValue !== undefined) {
			this.fill(defaultValue);
		}
	}
	clone():AnyMatrixUseObject{
		return Object.create(this, {
			_data: Object.assign(Object.getOwnPropertyDescriptor(this, '_data'), {
				value: Object.assign({},this._data)
			})
		});
	}
	getPrototypeData():any {
		return this._data;
	}
	fill(v: any): void {
		let data = this._data;
		let max = this.total;
		while (max--) {
			data[max] = v;
		}
	}
	fillRow(row: number, value: any) {
		let { width, height, _data } = this;
		if (!isInteger(row)) throw TypeError('row must be an integer');
		if (row < 0 || row >= height) throw RangeError('Parameter "row" is out of range');
		let index = width * row;
		while (width--) {
			_data[index++] = value;
		}
	}
	fillColumn(column: number, v: any) {
		let { width, _data, total } = this;
		if (!isInteger(column)) throw TypeError('column must be an integer');
		if (column < 0 || column >= width) throw RangeError('Parameter "column" is out of range');
		let index = column;
		while (index < total) {
			_data[index] = v;
			index += width;
		}
	}
	get(x, y) {
		if (!isInteger(x) || !isInteger(y)) throw TypeError('x and y must be an integer');
		if (x < 0 || x > this.width - 1) throw RangeError('x out of range');
		if (y < 0 || y > this.height - 1) throw RangeError('y out of range');
		return this._data[y * this.width + x];
	}
	set(x, y, v) {
		if (!isInteger(x) || !isInteger(y)) throw TypeError('x and y must be an integer');
		if (x < 0 || x > this.width - 1) throw RangeError('x out of range');
		if (y < 0 || y > this.height - 1) throw RangeError('y out of range');
		this._data[y * this.width + x] = v;
	}
	getRow(row: number): any[] {
		let { width, height, _data } = this;
		if (!isInteger(row)) throw TypeError('row must be an integer');
		if (row < 0 || row >= height) throw RangeError('Parameter "row" is out of range');
		let index = width * row;
		let arr = [];
		while (width--) {
			arr.push(_data[index++]);
		}
		return arr;
	}
	setRow(row: number, value: any[]) {
		let { width, height, _data } = this;
		if (!isInteger(row)) throw TypeError('row must be an integer');
		if (row < 0 || row >= height) throw RangeError('Parameter "row" is out of range');
		let index = width * row;
		let _end = width * (row + 1);
		let i = 0;
		while (i < value.length && index < _end) {
			_data[index++] = value[i++];
		}
	}
	getColumn(column: number): any[] {
		let { width, height, _data, total } = this;
		if (!isInteger(column)) throw TypeError('column must be an integer');
		if (column < 0 || column >= width) throw RangeError('Parameter "column" is out of range');
		let arr = [];
		let index = column;
		while (index < total) {
			arr.push(_data[index]);
			index += width;
		}
		return arr;
	}
	setColumn(column: number, value: any[]) {
		let { width, _data, total } = this;
		if (!isInteger(column)) throw TypeError('column must be an integer');
		if (column < 0 || column >= width) throw RangeError('Parameter "column" is out of range');
		let index = column;
		let i = 0;
		while (i < value.length && index < total) {
			_data[index] = value[i++];
			index += width;
		}
	}
	cellForEach(fn) {
		let { _data, width, total } = this;
		let x = 0,
			y = 0;
		for (let i = 0; i < total; i++) {
			fn(_data[i], x, y);
			if (++x >= width) {
				x = 0;
				y++;
			}
		}
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
}
export = AnyMatrixUseObject;
