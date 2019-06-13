export default function getTypedMatrixClass<T extends MimeTypeArray>(TypedArrayClass: any): {
    new (width: number, height: number, defaultValue?: number): {
        _data: any;
        _dataInit(): void;
        clone(): any;
        getPrototypeData(): any[];
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
        readonly width: number;
        readonly height: number;
        readonly total: number;
        Validator_row(row: any): void;
        Validator_column(column: any): void;
        Validator_xy(x: any, y: any): void;
        showView(): string;
        output(): string;
    };
    className: string;
    from<T_1 extends import("./Matrix").default>(this: new (a: any, b: any, c?: any) => T_1, matrixLike: import("./Matrix").default.MatrixLike, callback?: (v: any, x: any, y: any) => any, thisArg?: any): T_1;
    from<T_1 extends import("./Matrix").default>(this: new (a: any, b: any, c?: any) => T_1, arrayLike: any[], width?: number): T_1;
    input<T_1 extends import("./Matrix").default>(this: new (a: any, b: any, c?: any) => T_1, base64: string): T_1;
    output(matrix: import("./Matrix").default): string;
};
