declare namespace Matrix {
	export interface cmd {
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
}