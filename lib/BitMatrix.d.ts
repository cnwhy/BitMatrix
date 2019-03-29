/// <reference path="Matrix.declare.d.ts" />
import Matrix from './Matrix';
declare class BitMatrix extends Matrix implements Matrix.cmd {
    protected _data: Uint8Array;
    constructor(width: number, height: number, defaultValue?: number);
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
    showView(): string;
    private getIndex;
}
export = BitMatrix;
