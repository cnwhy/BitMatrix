import AnyMatrix from './AnyMatrix'
class Uint8Matrix extends AnyMatrix{
	protected _data: Uint8Array;
	constructor(width:number, height:number) {
		super(width,height);
	}
	protected _dataInit(){
		this._data = new Uint8Array(this.total);
	}
	// set(x: number, y: number, v: number) {
	// 	super.set(x, y, v);
	// }
}
export default Uint8Matrix;
