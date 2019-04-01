import { isInteger } from './Validator';

abstract class Matrix {
	readonly width: number;
	readonly height: number;
	readonly total: number;
	constructor(width: number, height: number) {
		if (!isInteger(width) || !isInteger(height)) throw RangeError('width and height must be an integer');
		if (width < 0 || height < 0) throw RangeError('width and height must be greater than 0');
		// if (!Number.isInteger(width) || !Number.isInteger(height))
		Object.defineProperty(this, 'width', { value: width });
		Object.defineProperty(this, 'height', { value: height });
		Object.defineProperty(this, 'total', { value: width * height });
	}
	abstract fill(value: any);
	abstract fillRow(row: number, value: any);
	abstract fillColumn(column: number, value: any);
	abstract get(x: number, y: number): any;
	abstract set(x: number, y: number, value: any);
	abstract getRow(y: number): any[];
	abstract setRow(y: number, row:any[]);
	abstract getColumn(x: number): any[];
	abstract setColumn(x: number, column: any[]);
	abstract cellForEach(fn: (value: any, x: number, y: number) => void);
	showView(): string{
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
	static from<T extends Matrix>(this:{new(a,b,c?):T}, arrayLike:any[],width?:number):T{//arrayLike[, mapFn[, thisArg]
		let _width:number,_height:number;
		if(width != undefined){
			if(!isInteger(width)) throw TypeError('width must be an integer');
			if(width<1) throw RangeError('x out of range');
			_width = width;
			_height = Math.ceil(arrayLike.length/_width);
			let m = new this(_width,_height);
			// m._data = arrayLike.slice(0);
			for(let i = 0; i<_height; i++){
				m.setRow(i,arrayLike.slice(i*_width,(i+1)*_width));
			}
			return m;
		}else{
			_width = arrayLike[0].length;
			_height = arrayLike.length;
			let m = new this(_width,_height);
			for(let i =0; i<arrayLike.length;i++){
				m.setRow(i,arrayLike[i]);
			}
			return m;
		}
	}
}
namespace Matrix {
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
		};
	}
	// export function from<T extends Matrix>(this:{new(a,b):T}, arrayLike:any[],width?:number):T{//arrayLike[, mapFn[, thisArg]
	// 	let _width:number,_height:number;
	// 	if(width != undefined){
	// 		if(!isInteger(width)) throw TypeError('width must be an integer');
	// 		if(width<1) throw RangeError('x out of range');
	// 		_width = width;
	// 		_height = Math.ceil(arrayLike.length/_width);
	// 		let m = new this(_width,_height);
	// 		// m._data = arrayLike.slice(0);
	// 		for(let i = 0; i<_height; i++){
	// 			m.setRow(i,arrayLike.slice(i*_width,(i+1)*_width));
	// 		}
	// 		return m;
	// 	}else{
	// 		_width = arrayLike[0].length;
	// 		_height = arrayLike.length;
	// 		let m = new this(_width,_height);
	// 		for(let i =0; i<arrayLike.length;i++){
	// 			m.setRow(i,arrayLike[i]);
	// 		}
	// 		return m;
	// 	}
	// }
}
export = Matrix;
