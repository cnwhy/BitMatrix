import AnyMatrix from './AnyMatrix';
declare class Int32Matrix extends AnyMatrix {
    protected _data: Int32Array;
    constructor(width: number, height: number);
    protected _dataInit(): void;
}
export default Int32Matrix;
