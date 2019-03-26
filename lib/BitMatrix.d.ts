import Matrix from './Matrix.I';
declare class BitMatrix extends Matrix implements Matrix.cmd {
    protected _data: Uint8Array;
    constructor(width: number, height: number);
    fill(value: boolean | number): void;
    fillRow(row: number, value: boolean | number): void;
    fillColumn(column: number, v: any): void;
    get(x: number, y: number): number;
    set(x: number, y: number, v: any): void;
    getRow(row: number): any[];
    setRow(row: number, value: any[]): void;
    getColumn(column: number): any[];
    setColumn(column: number, value: any[]): void;
    cellForEach(fn: (v: number, x: number, y: number) => void): void;
    rowForEach(fn: (v: boolean[], y: number) => void): any[];
    columnForEach(fn: (v: boolean[], x: number) => void): any[];
    showView(): string;
    private getIndex;
    private getPosition;
}
export = BitMatrix;
