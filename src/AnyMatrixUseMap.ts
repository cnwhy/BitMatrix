import Matrix from './Matrix.I';
class AnyMatrixUseMap extends Matrix implements Matrix.cmd {
	protected _data: any;
	constructor(width: number, height: number, defaultValue?) {
		super(width, height);
		this._data = new Map();
		if (defaultValue !== undefined) {
			this.fill(defaultValue);
		}
	}
	fill(v: any): void {
		let data = this._data;
		let max = this.total;
		while (max--) {
			data.set(max, v);
		}
	}
	fillRow(row: number, value: any) {
		let { width, height, _data } = this;
		if (row < 0 || row >= height) throw RangeError('Parameter "row" is out of range');
		let index = width * row;
		while (width--) {
			_data.set(index++, value);
		}
	}
	fillColumn(column: number, v: any) {
		let { width, _data, total } = this;
		if (column < 0 || column >= width) throw RangeError('Parameter "column" is out of range');
		let index = column;
		while (index < total) {
			_data.set(index, v);
			index += width;
		}
	}
	get(x, y) {
		if (x < 0 || x > this.width - 1) {
			throw RangeError('x out of range');
		}
		if (y < 0 || y > this.height - 1) {
			throw RangeError('y out of range');
		}
		return this._data.get(y * this.width + x);
		// let { index, offset } = this.getIndex(x, y);
		// // console.log(index, offset);
		// return !!((1 << offset) & this.byteArray[index]);
	}
	set(x, y, v) {
		if (x < 0 || x > this.width - 1) {
			throw RangeError('x out of range');
		}
		if (y < 0 || y > this.height - 1) {
			throw RangeError('y out of range');
		}
		this._data.set(y * this.width + x, v);
	}
	getRow(row: number): any[] {
		let { width, height, _data } = this;
		if (row < 0 || row >= height) throw RangeError('Parameter "row" is out of range');
		let index = width * row;
		let arr = [];
		while (width--) {
			arr.push(_data.get(index++));
		}
		return arr;
	}
	setRow(row: number, value: any[]) {
		let { width, height, _data } = this;
		if (row < 0 || row >= height) throw RangeError('Parameter "row" is out of range');
		let index = width * row;
		let _end = width * (row + 1);
		let i = 0;
		while (i < value.length && index < _end) {
			_data.set(index++, value[i++]);
		}
	}
	getColumn(column: number): any[] {
		let { width, height, _data, total } = this;
		if (column < 0 || column >= width) throw RangeError('Parameter "column" is out of range');
		let arr = [];
		let index = column;
		while (index < total) {
			arr.push(_data.get(index));
			index += width;
		}
		return arr;
	}
	setColumn(column: number, value: any[]) {
		let { width, _data, total } = this;
		if (column < 0 || column >= width) throw RangeError('Parameter "column" is out of range');
		let index = column;
		let i = 0;
		while (i < value.length && index < total) {
			_data.set(index, value[i++]);
			index += width;
		}
	}
	cellForEach(fn) {
		let { _data, width, total: _length } = this;
		let x = 0,
			y = 0;
		for (let i = 0; i < _length; i++) {
			fn(_data.get(i), x, y);
			if (++x >= width) {
				x = 0;
				y++;
			}
		}
	}
	showView(): string {
		let { width, height } = this;
		let _w = width - 1;
		let _h = height - 1;
		let str = '';
		this.cellForEach(function(v, x, y) {
			str += v;
			str += x < _w ? ',' : y < _h ? '\n' : '';
		});
		return str;
	}
}
export default AnyMatrixUseMap;
