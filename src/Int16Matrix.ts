import AnyMatrix from './AnyMatrix'
class Int16Matrix extends AnyMatrix{
	protected _data: Int16Array;
	constructor(width:number, height:number) {
		super(width,height);
	}
	protected _dataInit(){
		this._data = new Int16Array(this.total);
	}
	// set(x: number, y: number, v: number) {
	// 	super.set(x, y, v);
	// }
}
export default Int16Matrix;
