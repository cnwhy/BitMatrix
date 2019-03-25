import AnyMatrix from './AnyMatrix';
declare class Uint8Matrix extends AnyMatrix {
    protected _data: Uint8Array;
    constructor(width: number, height: number);
    protected _dataInit(): void;
}
export default Uint8Matrix;
