import AnyMatrix from './AnyMatrix';
declare class Uint16Matrix extends AnyMatrix {
    protected _data: Uint16Array;
    constructor(width: number, height: number);
    protected _dataInit(): void;
}
export default Uint16Matrix;
