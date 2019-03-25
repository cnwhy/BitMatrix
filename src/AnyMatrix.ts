import Matrix from './Matrix.I';
class AnyMatrix extends Matrix implements Matrix.cmd {
	protected _data: any | any[];
	constructor(width: number, height: number, defaultValue = 0) {
		super(width, height);
		this._dataInit();
		if (defaultValue != undefined) {
			this.fill(defaultValue);
		}
	}
	protected _dataInit() {
		this._data = new Array(this.total);
	}
	fill(value: any): void {
		this._data.fill(value);
	}
	fillRow(row: number, value: any) {
		let { width, height, _data } = this;
		if (row < 0 || row >= height) throw RangeError('Parameter "row" is out of range');
		let index = width * row;
		while (width--) {
			_data[index++] = value;
		}
	}
	fillColumn(column: number, v: any) {
		let { width, _data, total } = this;
		if (column < 0 || column >= width) throw RangeError('Parameter "column" is out of range');
		let index = column;
		while (index < total) {
			_data[index] = v;
			index += width;
		}
	}
	get(x: number, y: number) {
		if (x < 0 || x > this.width - 1) {
			throw RangeError('x out of range');
		}
		if (y < 0 || y > this.height - 1) {
			throw RangeError('y out of range');
		}
		return this._data[y * this.width + x];
	}
	set(x: number, y: number, v: any) {
		if (x < 0 || x > this.width - 1) {
			throw RangeError('x out of range');
		}
		if (y < 0 || y > this.height - 1) {
			throw RangeError('y out of range');
		}
		this._data[y * this.width + x] = v;
	}
	getRow(row: number): any[] {
		let { width, height, _data } = this;
		if (row < 0 || row >= height) throw RangeError('Parameter "row" is out of range');
		let start = width * row;
		return Array.from(this._data.slice(start, start + width));
	}
	setRow(row: number, value: any[]) {
		let { width, height, _data } = this;
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
		if (column < 0 || column >= width) throw RangeError('Parameter "column" is out of range');
		let arr = [];
		let index = column;
		while (index < total) {
			arr.push(_data[index]);
			index += width;
		}
		return arr;
	}
	setColumn(column: number, value:any[]){
		let { width, _data, total } = this;
		if (column < 0 || column >= width) throw RangeError('Parameter "column" is out of range');
		let index = column;
		let i = 0;
		while (i<value.length && index < total) {
			_data[index] = value[i++];
			index += width;
		}
	}
	cellForEach(fn) {
		let { _data: data, width, total: length } = this;
		let x = 0,
			y = 0;
		for (let i = 0; i < length; i++) {
			fn(data[i], x, y);
			if (++x >= width) {
				x = 0;
				y++;
			}
		}
	}
	showView():string {
		let { height } = this;
		let y = 0;
		let view = [];
		while (y < height) {
			view.push(this.getRow(y++).join(','));
		}
		return view.join('\n');
	}
}
export default AnyMatrix;
