import AnyMatrix from './AnyMatrix'
class Uint32Matrix extends AnyMatrix{
	protected _data: Uint32Array;
	constructor(width:number, height:number){
		super(width,height);
	}
	protected _dataInit(){
		this._data = new Uint32Array(this.total);
	}
	// set(x: number, y: number, v: number) {
	// 	super.set(x, y, v);
	// }
}
export default Uint32Matrix;
