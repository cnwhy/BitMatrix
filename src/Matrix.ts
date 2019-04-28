import { isInteger } from './Validator';
import * as Base64 from '@cnwhy/base64';

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

abstract class Matrix {
	readonly width: number;
	readonly height: number;
	readonly total: number;
	protected _data: any;
	constructor(width: number, height: number) {
		if (!isInteger(width) || !isInteger(height)) throw RangeError('width and height must be an integer');
		if (width < 0 || height < 0) throw RangeError('width and height must be greater than 0');
		Object.defineProperty(this, 'width', { value: width });
		Object.defineProperty(this, 'height', { value: height });
		Object.defineProperty(this, 'total', { value: width * height });
	}
	abstract clone();
	abstract getPrototypeData(): any;
	abstract fill(value: any);
	abstract fillRow(row: number, value: any);
	abstract fillColumn(column: number, value: any);
	abstract get(x: number, y: number): any;
	abstract set(x: number, y: number, value: any);
	abstract getRow(y: number): any[];
	abstract setRow(y: number, row: any[]);
	abstract getColumn(x: number): any[];
	abstract setColumn(x: number, column: any[]);
	abstract cellForEach(fn: (value: any, x: number, y: number) => void);
	Validator_row(row) {
		if (!isInteger(row)) throw TypeError('row must be an integer');
		if (row < 0 || row >= this.height) throw RangeError('Parameter "row" is out of range');
	}
	Validator_column(column) {
		if (!isInteger(column)) throw TypeError('column must be an integer');
		if (column < 0 || column >= this.width) throw RangeError('Parameter "column" is out of range');
	}
	Validator_xy(x, y) {
		if (!isInteger(x) || !isInteger(y)) throw TypeError('x and y must be an integer');
		if (x < 0 || x >= this.width) throw RangeError('x out of range');
		if (y < 0 || y >= this.height) throw RangeError('y out of range');
	}
	showView(): string {
		let { height } = this;
		let y = 0;
		let view = [];
		while (y < height) {
			view.push(this.getRow(y++).join(','));
		}
		return view.join('\n');

		// let { width, height } = this;
		// let _w = width - 1;
		// let _h = height - 1;
		// let str = '';
		// this.cellForEach(function(v, x, y) {
		// 	str += v;
		// 	str += x < _w ? ',' : y < _h ? '\n' : '';
		// });
		// return str;
	}
	static from<T extends Matrix>(
		this: { new (a, b, c?): T },
		matrixLike: Matrix.MatrixLike,
		callback?: (v, x, y) => any,
		thisArg?: any
	): T;
	static from<T extends Matrix>(this: { new (a, b, c?): T }, arrayLike: any[], width?: number): T;
	static from<T extends Matrix>(this: { new (a, b, c?): T }, matrix, callback?, thisArg?): T {
		if (matrix instanceof Matrix || (matrix.width && matrix.height && typeof matrix.get == 'function')) {
			if (matrix instanceof this && callback == undefined) {
				return matrix.clone();
			} else {
				let m = new this(matrix.width, matrix.height);
				let cb =
					typeof callback === 'function' ? (thisArg ? callback.bind(thisArg) : callback) : null;
				let fun = cb
					? (v, x, y) => {
							m.set(x, y, cb(v, x, y));
					  }
					: (v, x, y) => {
							m.set(x, y, v);
					  };
				if (typeof matrix.cellForEach === 'function') {
					matrix.cellForEach(fun);
				} else {
					for (let y = 0; y < matrix.height; y++) {
						for (let x = 0; x < matrix.width; x++) {
							fun(matrix.get(x, y), x, y);
						}
					}
				}
				return m;
			}
		} else {
			let _width: number, _height: number;
			let arrayLike = matrix;
			let width = callback;
			if (width != undefined) {
				if (!isInteger(width)) throw TypeError('width must be an integer');
				if (width < 1) throw RangeError('x out of range');
				_width = width;
				_height = Math.ceil(arrayLike.length / _width);
				let m = new this(_width, _height);
				// m._data = arrayLike.slice(0);
				for (let i = 0; i < _height; i++) {
					m.setRow(i, arrayLike.slice(i * _width, (i + 1) * _width));
				}
				return m;
			} else {
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
	static input<T extends Matrix>(this: { new (a, b, c?): T },base64: string) {
		let barray: Uint8Array = Base64.decode(base64);
		let baseView = new DataView(barray.buffer);
		let width = baseView.getUint32(0);
		let height = baseView.getUint32(4);
		let type = baseView.getUint8(8);
		let matrix = new this(width, height);
		let _type = dataMark.indexOf(Object.prototype.toString.call(matrix._data))
		let DataType = dataType[type];
		if(_type !== type) throw new TypeError('导入数据类型与当前 Matrix类型不一至!');
		if(type >= 2 && DataType){
			matrix._data = new DataType(barray.buffer.slice(9));
		}else{
			matrix._data = JSON.parse(Base64.utf8Decode(barray.buffer.slice(9)));
		}
		return matrix;
	}
	static output(matrix: Matrix) {
		if(!(matrix instanceof Matrix)) throw new TypeError('The parameter must be a Matrix type')
		let { width, height, total } = matrix;
		let type = dataMark.indexOf(Object.prototype.toString.call(matrix._data));
		let baseBuffer = new ArrayBuffer(9);
		let baseView = new DataView(baseBuffer);
		let data = type >= 2 ? matrix._data.buffer.slice(0) : JSON.stringify(matrix._data);
		if(type == -1) throw new TypeError('Matrix类型不支持导出!');
		baseView.setUint32(0, width);
		baseView.setUint32(4, height);
		baseView.setUint8(8, type);
		// 由于是baseBuffer是占9byte base64编码时可以直接拼接
		return Base64.encode(baseBuffer) + Base64.encode(data);
	}
	output(){
		return Matrix.output(this);
	}
}
namespace Matrix {
	export interface MatrixLike {
		width: number;
		height: number;
		get(x: number, y: number): any;
		cellForEach?(callback: (v: any, x: number, y: number) => any): any;
	}
	export function getTypedMatrixClass<T extends MimeTypeArray>(AnyMatrix, TypedArrayClass: any) {
		let name = TypedArrayClass.name.replace('Array', 'Matrix');
		return class extends AnyMatrix {
			static className: string = name;
			_data: any | any[];
			// constructor(width: number, height: number, defaultValue = 0) {
			// 	super(width, height, defaultValue);
			// }
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
		};
	}
}
export default Matrix;
