import Matrix from './Matrix';

class AnyMatrix extends Matrix {
	protected _data: any[];
	constructor(width: number, height: number, defaultValue:any = 0) {
		super(width, height);
		this._dataInit();
		if (defaultValue != undefined) {
			this.fill(defaultValue);
		}
	}
	protected _dataInit() {
		this._data = new Array(this.total);
	}
	getPrototypeData():any[] {
		return this._data;
	}
	clone():AnyMatrix{
		return Object.create(this, {
			_data: Object.assign(Object.getOwnPropertyDescriptor(this, '_data'), {
				value: this._data.slice(0)
			})
		});
	}
	fill(value: any): void {
		this._data.fill(value);
	}
	fillRow(row: number, value: any) {
		this.Validator_row(row);
		let { width, _data } = this;
		let index = width * row;
		while (width--) {
			_data[index++] = value;
		}
	}
	fillColumn(column: number, v: any) {
		this.Validator_column(column);
		let { width, _data, total } = this;
		let index = column;
		while (index < total) {
			_data[index] = v;
			index += width;
		}
	}
	get(x: number, y: number) {
		this.Validator_xy(x,y);
		return this._data[y * this.width + x];
	}
	set(x: number, y: number, v: any) {
		this.Validator_xy(x,y);
		this._data[y * this.width + x] = v;
	}
	getRow(row: number): any[] {
		this.Validator_row(row);
		let { width, _data } = this;
		let start = width * row;
		// return Array.from(this._data.slice(start, start + width));
		return Array.prototype.slice.call(_data, start, start + width);
	}
	setRow(row: number, value: any[]) {
		this.Validator_row(row);
		let { width, _data } = this;
		let index = width * row;
		let _end = width * (row + 1);
		let i = 0;
		while (i < value.length && index < _end) {
			_data[index++] = value[i++];
		}
	}
	getColumn(column: number): any[] {
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
	setColumn(column: number, value: any[]) {
		this.Validator_column(column);
		let { width, _data, total } = this;
		let index = column;
		let i = 0;
		while (i < value.length && index < total) {
			_data[index] = value[i++];
			index += width;
		}
	}
	cellForEach(fn: (arg0: any, arg1: number, arg2: number) => void) {
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
export default AnyMatrix;
