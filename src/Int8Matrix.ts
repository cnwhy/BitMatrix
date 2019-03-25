import AnyMatrix from './AnyMatrix';
class Int8Matrix extends AnyMatrix {
	protected _data: Int8Array;
	constructor(width: number, height: number) {
		super(width, height);
	}
	protected _dataInit() {
		this._data = new Int8Array(this.total);
	}
	// set(x: number, y: number, v: number) {
	// 	super.set(x, y, v);
	// }
}
export default Int8Matrix;
