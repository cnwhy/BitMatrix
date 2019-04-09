import Matrix from './Matrix';
declare class AnyMatrixUseObject extends Matrix {
    protected _data: any;
    constructor(width: number, height: number, defaultValue?: any);
    clone(): AnyMatrixUseObject;
    getPrototypeData(): any;
    fill(v: any): void;
    fillRow(row: number, value: any): void;
    fillColumn(column: number, v: any): void;
    get(x: any, y: any): any;
    set(x: any, y: any, v: any): void;
    getRow(row: number): any[];
    setRow(row: number, value: any[]): void;
    getColumn(column: number): any[];
    setColumn(column: number, value: any[]): void;
    cellForEach(fn: any): void;
}
export = AnyMatrixUseObject;
