import AnyMatrix from './AnyMatrix'
class Int32Matrix extends AnyMatrix{
	protected _data: Int32Array;
	constructor(width:number, height:number) {
		super(width,height);
	}
	protected _dataInit(){
		this._data = new Int32Array(this.total);
	}
	// set(x: number, y: number, v: number) {
	// 	super.set(x, y, v);
	// }
}
export default Int32Matrix;
