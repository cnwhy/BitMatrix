import Matrix from './Matrix.I';
declare class AnyMatrixUseMap extends Matrix implements Matrix.cmd {
    protected _data: any;
    constructor(width: number, height: number, defaultValue?: any);
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
    showView(): string;
}
export default AnyMatrixUseMap;
