declare namespace Matrix {
	export interface cmd {
		fill(value: any);
		fillRow(row: number, value: any);
		fillColumn(column: number, value: any);
		get(x: number, y: number): any;
		set(x: number, y: number, value: any);
		getRow(y: number): any[];
		setRow(y: number, row:any[]);
		getColumn(x: number): any[];
		setColumn(x: number, column: any[]);
		cellForEach(fn: (value: any, x: number, y: number) => void);
		showView(): string;
	}
}