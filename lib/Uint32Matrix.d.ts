import AnyMatrix from './AnyMatrix';
declare class Uint32Matrix extends AnyMatrix {
    protected _data: Uint32Array;
    constructor(width: number, height: number);
    protected _dataInit(): void;
}
export default Uint32Matrix;
