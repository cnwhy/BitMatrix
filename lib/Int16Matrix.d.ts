import AnyMatrix from './AnyMatrix';
declare class Int16Matrix extends AnyMatrix {
    protected _data: Int16Array;
    constructor(width: number, height: number);
    protected _dataInit(): void;
}
export default Int16Matrix;
