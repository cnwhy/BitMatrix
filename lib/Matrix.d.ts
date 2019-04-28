declare abstract class Matrix {
    readonly width: number;
    readonly height: number;
    readonly total: number;
    protected _data: any;
    constructor(width: number, height: number);
    abstract clone(): any;
    abstract getPrototypeData(): any;
    abstract fill(value: any): any;
    abstract fillRow(row: number, value: any): any;
    abstract fillColumn(column: number, value: any): any;
    abstract get(x: number, y: number): any;
    abstract set(x: number, y: number, value: any): any;
    abstract getRow(y: number): any[];
    abstract setRow(y: number, row: any[]): any;
    abstract getColumn(x: number): any[];
    abstract setColumn(x: number, column: any[]): any;
    abstract cellForEach(fn: (value: any, x: number, y: number) => void): any;
    Validator_row(row: any): void;
    Validator_column(column: any): void;
    Validator_xy(x: any, y: any): void;
    showView(): string;
    static from<T extends Matrix>(this: {
        new (a: any, b: any, c?: any): T;
    }, matrixLike: Matrix.MatrixLike, callback?: (v: any, x: any, y: any) => any, thisArg?: any): T;
    static from<T extends Matrix>(this: {
        new (a: any, b: any, c?: any): T;
    }, arrayLike: any[], width?: number): T;
    static input<T extends Matrix>(this: {
        new (a: any, b: any, c?: any): T;
    }, base64: string): T;
    static output(matrix: Matrix): string;
    output(): string;
}
declare namespace Matrix {
    interface MatrixLike {
        width: number;
        height: number;
        get(x: number, y: number): any;
        cellForEach?(callback: (v: any, x: number, y: number) => any): any;
    }
    function getTypedMatrixClass<T extends MimeTypeArray>(AnyMatrix: any, TypedArrayClass: any): {
        new (): {
            [x: string]: any;
            _data: any;
            _dataInit(): void;
            clone(): any;
        };
        [x: string]: any;
        className: string;
    };
}
export default Matrix;
