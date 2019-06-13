import Matrix from './Matrix';
declare class AnyMatrix extends Matrix {
    protected _data: any[];
    constructor(width: number, height: number, defaultValue?: any);
    protected _dataInit(): void;
    getPrototypeData(): any[];
    clone(): AnyMatrix;
    fill(value: any): void;
    fillRow(row: number, value: any): void;
    fillColumn(column: number, v: any): void;
    get(x: number, y: number): any;
    set(x: number, y: number, v: any): void;
    getRow(row: number): any[];
    setRow(row: number, value: any[]): void;
    getColumn(column: number): any[];
    setColumn(column: number, value: any[]): void;
    cellForEach(fn: (arg0: any, arg1: number, arg2: number) => void): void;
}
export default AnyMatrix;
