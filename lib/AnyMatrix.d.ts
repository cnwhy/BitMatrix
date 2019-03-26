import Matrix from './Matrix.I';
declare class AnyMatrix extends Matrix implements Matrix.cmd {
    protected _data: any | any[];
    constructor(width: number, height: number, defaultValue?: number);
    protected _dataInit(): void;
    fill(value: any): void;
    fillRow(row: number, value: any): void;
    fillColumn(column: number, v: any): void;
    get(x: number, y: number): any;
    set(x: number, y: number, v: any): void;
    getRow(row: number): any[];
    setRow(row: number, value: any[]): void;
    getColumn(column: number): any[];
    setColumn(column: number, value: any[]): void;
    cellForEach(fn: any): void;
    showView(): string;
    static getTypedMatrixClass(TypedArrayClass: any): {
        new (width: number, height: number): {
            _data: any;
            _dataInit(): void;
            fill(value: any): void;
            fillRow(row: number, value: any): void;
            fillColumn(column: number, v: any): void;
            get(x: number, y: number): any;
            set(x: number, y: number, v: any): void;
            getRow(row: number): any[];
            setRow(row: number, value: any[]): void;
            getColumn(column: number): any[];
            setColumn(column: number, value: any[]): void;
            cellForEach(fn: any): void;
            showView(): string;
            width: number;
            height: number;
            total: number;
        };
        className: string;
        getTypedMatrixClass(TypedArrayClass: any): any;
        Row: typeof Matrix.Row;
    };
}
export = AnyMatrix;
