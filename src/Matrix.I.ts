class Matrix {
	width: number;
	height: number;
	total: number;
	constructor(width: number, height: number) {
		if (width < 0 || height < 0) throw RangeError('width and height must be greater than 0');
		if (!Number.isInteger(width) || !Number.isInteger(height))
			throw RangeError('width and height must be an integer');
		Object.defineProperty(this, 'width', { value: width });
		Object.defineProperty(this, 'height', { value: height });
		Object.defineProperty(this, 'total', { value: width * height });
	}
}

declare namespace Matrix {
	export interface cmd {
		width: number;
		height: number;
		fill(v: any);
		fillRow(row: number, value: any);
		fillColumn(column: number, value: any);
		get(x: number, y: number): any;
		set(x: number, y: number, v: any);
		getRow(y: number): any[];
		setRow(y: number, row);
		getColumn(x: number): any[];
		setColumn(x: number, column: any[]);
		cellForEach(fn: (v: any, x: number, y: number) => void);
		showView(): string;
	}
	export class Row {
		index: number;
		length: number;
		forEach(fn: (value, index: number, row: Row) => any);
		get(index: number): any;
		set(index: number, value);
	}
}

export = Matrix;
