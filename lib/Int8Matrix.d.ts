import AnyMatrix from './AnyMatrix';
declare class Int8Matrix extends AnyMatrix {
    protected _data: Int8Array;
    constructor(width: number, height: number);
    protected _dataInit(): void;
}
export default Int8Matrix;
