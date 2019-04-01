declare abstract class Matrix {
    readonly width: number;
    readonly height: number;
    readonly total: number;
    constructor(width: number, height: number);
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
    showView(): string;
    static from<T extends Matrix>(this: {
        new (a: any, b: any, c?: any): T;
    }, arrayLike: any[], width?: number): T;
}
declare namespace Matrix {
    function getTypedMatrixClass<T extends MimeTypeArray>(AnyMatrix: any, TypedArrayClass: any): {
        new (): {
            [x: string]: any;
            _data: any;
            _dataInit(): void;
        };
        [x: string]: any;
        className: string;
    };
}
export = Matrix;
