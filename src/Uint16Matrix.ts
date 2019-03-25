import AnyMatrix from './AnyMatrix'
class Uint16Matrix extends AnyMatrix{
	protected _data: Uint16Array;
	constructor(width:number, height:number){
		super(width,height);
	}
	protected _dataInit(){
		this._data = new Uint16Array(this.total);
	}
	// set(x: number, y: number, v: number) {
	// 	super.set(x, y, v);
	// }
}
export default Uint16Matrix;
