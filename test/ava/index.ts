import test from 'ava';
import { allClass } from '../import';
import AnyMatrix from '../../src/AnyMatrix';

const view11 = `1`;
const view22 = `1,0
0,1`;
const view55 = `0,1,0,1,0
1,1,1,1,1
0,1,0,1,0
1,1,1,1,1
0,1,0,1,0`;

function all0(matrix) {
	let is0 = v => {
		if (v !== 0) {
			throw 'Test is not through!';
		}
	};
	if (matrix.cellForEach) {
		matrix.cellForEach(is0);
	} else {
		matrix.forEach(is0);
	}
}

function all1(matrix) {
	let is1 = (v, x, y) => {
		// console.log(v,x,y);
		if (v !== 1) {
			console.log(matrix.showView());
			throw 'Test is not through!';
		}
	};
	if (matrix.cellForEach) {
		matrix.cellForEach(is1);
	} else {
		matrix.forEach(is1);
	}
}

function diff(arr1, arr2) {
	if (arr1.length != arr2.length) throw 'Test is not through!';
	for (let i = 0; i < arr1.length; i++) {
		if (arr1[i] !== arr2[i]) throw 'Test is not through!';
	}
}

function matrix2Array(matrix) {
	let arr = [];
	for (let y = 0; y < matrix.height; y++) {
		let row = (arr[y] = []);
		for (let x = 0; x < matrix.width; x++) {
			row[x] = matrix.get(x, y);
		}
	}
	return arr;
}

function getRandomArray(length) {
	let arr = [];
	for (let i = 0; i < length; i++) {
		arr.push(Math.random() > 0.5 ? 1 : 0);
	}
	return arr;
}

function arrSetRow(arr, y, data) {
	let _row = arr[y];
	let _i = 0;
	while (_i < _row.length && _i < data.length) {
		_row[_i] = data[_i];
		_i++;
	}
}

function arrSetColumn(arr, x, data) {
	let _i = 0;
	while (_i < arr.length && _i < data.length) {
		arr[_i][x] = data[_i];
		_i++;
	}
}

function getRow(matrix, row) {
	let { width } = matrix;
	let arr = [];
	for (let i = 0; i < width; i++) {
		arr.push(matrix.get(i, row));
	}
	return arr;
}

function getColumn(matrix, column) {
	let { height } = matrix;
	let arr = [];
	for (let i = 0; i < height; i++) {
		arr.push(matrix.get(column, i));
	}
	return arr;
}

// 和尺寸无关的检测, 主要是参数验证相关测试
function noSize(Matrix) {
	let name = Matrix['className'] || Matrix['name'];

	test(`[${name}] 矩形宽高只能为数字`, t => {
		t.plan(3);
		t.throws(() => {
			new Matrix('3', '3');
		});
		t.throws(() => {
			new Matrix(3, '3');
		});
		t.throws(() => {
			new Matrix('3', 3);
		});
	});

	test(`[${name}] 矩形宽高不能小于0`, t => {
		t.plan(3);
		t.throws(() => {
			new Matrix(-1, 10);
		});
		t.throws(() => {
			new Matrix(0, -1);
		});
		t.throws(() => {
			new Matrix(-1, -1);
		});
	});

	//API 检测
	test(`[${name}]  对像 width,height,total 属性值正确性测试`, t => {
		t.plan(3);
		let x = 30,
			y = 10;
		let matrix = new Matrix(x, y);
		t.is(matrix.width, x);
		t.is(matrix.height, y);
		t.is(matrix.total, x * y);
	});

	test(`[${name}]  对像 width,height,total 属性只读性测试`, t => {
		t.plan(6);
		let x = 30,
			y = 10;
		let matrix = new Matrix(x, y);
		t.throws(() => {
			matrix.width = 1;
		});
		t.throws(() => {
			matrix.height = 1;
		});
		t.throws(() => {
			matrix.total = 1;
		});
		t.is(matrix.width, x);
		t.is(matrix.height, y);
		t.is(matrix.total, x * y);
	});

	test(`[${name}] .set .get 参数检查`, t => {
		t.plan(10);
		let x = 10,
			y = 10;
		let matrix = new Matrix(x, y, 0);
		t.throws(() => {
			matrix.set(0, -1, 0);
		});
		t.throws(() => {
			matrix.set(0, y, 0);
		});
		t.throws(() => {
			matrix.set(-1, 0, 0);
		});
		t.throws(() => {
			matrix.set(x, 0, 0);
		});
		t.throws(() => {
			matrix.get(0, -1);
		});
		t.throws(() => {
			matrix.get(0, y);
		});
		t.throws(() => {
			matrix.get(-1, 0);
		});
		t.throws(() => {
			matrix.get(x, 0);
		});
		t.throws(() => {
			matrix.set('a', 'b', 0);
		});
		t.throws(() => {
			matrix.get('1', '1', 0);
		});
	});

	test(`[${name}] .getRow 参数测试`, t => {
		t.plan(3);
		let x = 30,
			y = 5;
		let matrix = new Matrix(x, y, 1);
		t.throws(() => {
			matrix.getRow(-1);
		});
		t.throws(() => {
			matrix.getRow(5);
		});
		t.throws(() => {
			matrix.getRow('0');
		});
	});

	test(`[${name}] .setRow 参数测试`, t => {
		t.plan(3);
		let x = 30,
			y = 5;
		let matrix = new Matrix(x, y, 1);

		t.throws(() => {
			matrix.setRow(-1, 0);
		});
		t.throws(() => {
			matrix.setRow(5, 0);
		});
		t.throws(() => {
			matrix.setRow('0', 0);
		});
	});

	test(`[${name}] .getColumn 参数测试`, t => {
		t.plan(3);
		let matrix = new Matrix(5, 5, 1);
		t.throws(() => {
			matrix.getColumn(-1);
		});
		t.throws(() => {
			matrix.getColumn(5);
		});
		t.throws(() => {
			matrix.getColumn('0');
		});
	});

	test(`[${name}] .setColumn 参数测试`, t => {
		t.plan(3);
		let matrix = new Matrix(5, 5, 1);
		t.throws(() => {
			matrix.setColumn(-1, 0);
		});
		t.throws(() => {
			matrix.setColumn(5, 0);
		});
		t.throws(() => {
			matrix.setColumn('0', 0);
		});
	});

	test(`[${name}] from 参数测试`, t => {
		t.plan(4);
		t.throws(() => {
			Matrix.from(3);
		});
		t.throws(() => {
			Matrix.from([1, 2], 0);
		});
		t.throws(() => {
			Matrix.from([1, 2], -1);
		});
		t.throws(() => {
			Matrix.from([1, 2], '0');
		});
	});
}

function testSize(Matrix, view, exp) {
	let name = Matrix['className'] || Matrix['name'];

	function getArr() {
		return view.split('\n').map(v => v.split(',').map(k => +k));
	}
	function getMatrix() {
		return Matrix.from(getArr());
	}
	test.serial(`[${name}] from(arr[][]) ${exp}`, t => {
		let matrix = getMatrix();
		t.is(matrix.showView(), view);
	});
	test.serial(`[${name}] from(arr[],width) ${exp}`, t => {
		let data1 = view.split(/[\n,]/).map(v => +v); //arr[]
		let matrix1 = Matrix.from(data1, +exp.split('*')[0]);
		t.is(matrix1.showView(), view);
	});
	test.serial(`[${name}] from(Matrix,callback?,argThis?) ${exp}`, t => {
		t.plan(5);
		let am = new AnyMatrix(5, 5, 0);
		let matrix1 = Matrix.from(am);
		let matrix2 = Matrix.from(am, v => {
			return v + 1;
		});
		let matrix3 = Matrix.from(
			am,
			function(v) {
				// console.log(this)
				// throw '';
				return this;
			},
			1
		);
		t.true(matrix1 instanceof Matrix);
		t.notThrows(() => {
			all0(matrix1);
		});
		t.notThrows(() => {
			all1(matrix2);
		});
		t.notThrows(() => {
			all1(matrix3);
		});
		am.fill(1);
		t.notThrows(() => {
			all0(matrix1);
		});
	});
	test.serial(`[${name}] from(MatrixLike,callback?,argThis?) ${exp}`, t => {
		t.plan(2);
		let matrixLike = {
			width: 10,
			height: 10,
			get(x, y) {
				return 0;
			}
		};
		let matrix1 = Matrix.from(matrixLike);
		let matrix2 = Matrix.from(matrixLike, function() {
			return 1;
		});

		t.notThrows(() => {
			all0(matrix1);
		});

		t.notThrows(() => {
			all1(matrix2);
		});
	});

	test.serial(`[${name}] getRow(row) ${exp}`, t => {
		let matrix = getMatrix();
		let arr = getArr();
		t.plan(matrix.height);
		for (let i = 0; i < matrix.height; i++) {
			t.deepEqual(matrix.getRow(i), arr[i]);
		}
	});

	test.serial(`[${name}] getColumn() ${exp}`, t => {
		let matrix = getMatrix();
		let arr = getArr();
		t.plan(matrix.width);
		for (let i = 0; i < matrix.width; i++) {
			t.deepEqual(matrix.getColumn(i), arr.map(v => v[i]));
		}
	});

	test.serial(`[${name}] setRow() ${exp}`, t => {
		t.plan(3);
		let matrix = getMatrix();
		let arr = getArr();
		let rArray1 = getRandomArray(matrix.width >> 1 > 0 ? matrix.width >> 2 : 1);
		let rArray2 = getRandomArray(matrix.width);
		let rArray3 = getRandomArray(matrix.width * 2);

		for (let i = 0; i < matrix.height; i++) {
			matrix.setRow(i, rArray1);
			arrSetRow(arr, i, rArray1);
		}
		t.deepEqual(matrix2Array(matrix), arr);
		for (let i = 0; i < matrix.height; i++) {
			matrix.setRow(i, rArray2);
			arrSetRow(arr, i, rArray2);
		}
		t.deepEqual(matrix2Array(matrix), arr);
		for (let i = 0; i < matrix.height; i++) {
			matrix.setRow(i, rArray3);
			arrSetRow(arr, i, rArray3);
		}
		t.deepEqual(matrix2Array(matrix), arr);
	});
	test.serial(`[${name}] setColumn() ${exp}`, t => {
		t.plan(3);
		let matrix = getMatrix();
		let arr = getArr();
		let rArray1 = getRandomArray(matrix.width >> 1 > 0 ? matrix.width >> 2 : 1);
		let rArray2 = getRandomArray(matrix.width);
		let rArray3 = getRandomArray(matrix.width * 2);
		for (let i = 0; i < matrix.width; i++) {
			matrix.setColumn(i, rArray1);
			arrSetColumn(arr, i, rArray1);
		}
		t.deepEqual(matrix2Array(matrix), arr);
		for (let i = 0; i < matrix.width; i++) {
			matrix.setColumn(i, rArray2);
			arrSetColumn(arr, i, rArray2);
		}
		t.deepEqual(matrix2Array(matrix), arr);
		for (let i = 0; i < matrix.width; i++) {
			matrix.setColumn(i, rArray3);
			arrSetColumn(arr, i, rArray3);
		}
		t.deepEqual(matrix2Array(matrix), arr);
	});
	test.serial(`[${name}] fillRow() ${exp}`, t => {
		let matrix = getMatrix();
		let arr = getArr();
		t.plan(matrix.height);
		for (let i = 0; i < matrix.height; i++) {
			var v = Math.random() > 0.5 ? 1 : 0;
			matrix.fillRow(i, v);
			arr[i].fill(v);
			t.deepEqual(matrix2Array(matrix), arr);
		}
	});
	test.serial(`[${name}] fillColumn() ${exp}`, t => {
		let matrix = getMatrix();
		let arr = getArr();
		t.plan(matrix.width);
		for (let i = 0; i < matrix.width; i++) {
			var v = Math.random() > 0.5 ? 1 : 0;
			matrix.fillColumn(i, v);
			arr = arr.map(r => {
				r[i] = v;
				return r;
			});
			t.deepEqual(matrix2Array(matrix), arr);
		}
	});

	test.serial(`[${name}] input output ${exp}`,t =>{
		t.plan(3);
		let matrix = getMatrix();
		let base64str = Matrix.output(matrix);
		let base64str1 = matrix.output();
		let matrix1 = Matrix.input(base64str);
		t.is(typeof base64str,'string');
		t.is(base64str,base64str1);
		t.deepEqual(matrix2Array(matrix),matrix2Array(matrix1))
	});
}

function testOther(Matrix) {
	let name = Matrix['className'] || Matrix['name'];
	test(`[${name}] '.showView'`, t => {
		let matrix = new Matrix(5, 5, 0);
		matrix.fillRow(1, 1);
		matrix.fillRow(3, 1);
		matrix.fillColumn(1, 1);
		matrix.fillColumn(3, 1);
		t.is(matrix.showView(), view55);
	});

	test(`[${name}] clone `, t => {
		t.plan(2);
		let matrix = new Matrix(5, 5, 0);
		let cloneMatrix = matrix.clone();
		cloneMatrix.fillRow(1, 1);
		cloneMatrix.fillRow(3, 1);
		cloneMatrix.fillColumn(1, 1);
		cloneMatrix.fillColumn(3, 1);
		t.is(cloneMatrix.showView(), view55);
		t.notThrows(() => {
			all0(matrix);
		});
	});
	test(`[${name}] getPrototypeData `, t => {
		let matrix = new Matrix(5, 5);
		t.is(typeof matrix.getPrototypeData(), 'object');
	});
}

function testFn(Matrix) {
	let name = Matrix['className'] || Matrix['name'];
	// const Matrix = AnyMatrix;
	// Matrix.prototype.setColumn

	test.serial(`[${name}]  new 初始值测试`, t => {
		t.plan(2);
		let x = 30,
			y = 10;
		let matrix = new Matrix(x, y, 0);
		let matrix1 = new Matrix(x, y, 1);
		t.notThrows(() => {
			all0(matrix);
		});
		t.notThrows(() => {
			all1(matrix1);
		});
	});

	test.serial(`[${name}] .set .get 功能检查`, t => {
		t.plan(9);
		let x = 30,
			y = 10;
		let matrix = new Matrix(x, y, 0);
		matrix.set(0, 0, 1);
		t.is(matrix.get(0, 0), 1);
		matrix.set(2, 0, 1);
		t.is(matrix.get(2, 0), 1);
		matrix.set(4, 0, 1);
		t.is(matrix.get(4, 0), 1);
		matrix.set(0, 5, 1);
		t.is(matrix.get(0, 5), 1);
		matrix.set(2, 5, 1);
		t.is(matrix.get(2, 5), 1);
		matrix.set(4, 5, 1);
		t.is(matrix.get(4, 5), 1);
		matrix.set(0, 9, 1);
		t.is(matrix.get(0, 9), 1);
		matrix.set(2, 9, 1);
		t.is(matrix.get(2, 9), 1);
		matrix.set(4, 9, 1);
		t.is(matrix.get(4, 9), 1);
	});

	test.serial(`[${name}] .fill 测试`, t => {
		t.plan(2);
		let x = 30,
			y = 10;
		let matrix = new Matrix(x, y, 1);
		matrix.fill(0);
		t.notThrows(() => {
			all0(matrix);
		});
		matrix.fill(1);
		t.notThrows(() => {
			all1(matrix);
		});
	});

	test.serial(`[${name}] .fillRow 测试`, t => {
		t.plan(7);
		let x = 30,
			y = 10;
		let matrix = new Matrix(x, y, 1);
		t.throws(() => {
			matrix.fillRow(-1, 0);
		});
		t.throws(() => {
			matrix.fillRow(y, 0);
		});
		t.throws(() => {
			matrix.fillRow('0', 0);
		});
		matrix.fillRow(0, 0);
		t.notThrows(() => {
			all0(getRow(matrix, 0));
		});
		matrix.fillRow(0, 1);
		t.notThrows(() => {
			all1(getRow(matrix, 0));
		});
		matrix.fillRow(2, 0);
		t.notThrows(() => {
			all0(getRow(matrix, 2));
		});
		matrix.fillRow(9, 0);
		t.notThrows(() => {
			all0(getRow(matrix, 9));
		});
	});

	test.serial(`[${name}] .fillColumn 测试`, t => {
		t.plan(7);
		let x = 30,
			y = 10;
		let matrix = new Matrix(x, y, 1);
		t.throws(() => {
			matrix.fillColumn(-1, 0);
		});
		t.throws(() => {
			matrix.fillColumn(x, 0);
		});
		t.throws(() => {
			matrix.fillColumn('0', 0);
		});
		matrix.fillColumn(0, 0);
		t.notThrows(() => {
			all0(getColumn(matrix, 0));
		});
		matrix.fillColumn(0, 1);
		t.notThrows(() => {
			all1(getColumn(matrix, 0));
		});
		matrix.fillColumn(2, 0);
		t.notThrows(() => {
			all0(getColumn(matrix, 2));
		});
		matrix.fillColumn(4, 0);
		t.notThrows(() => {
			all0(getColumn(matrix, 4));
		});
	});

	test.serial(`[${name}] .getRow`, t => {
		t.plan(3);
		let x = 30,
			y = 5;
		let matrix = new Matrix(x, y, 1);
		// let matrix1 = new Matrix(x, y, 1);
		// let row = [1, 0, 1, 1, 0];
		let row = new Array(x).fill(1).map((v, i) => (i % 2 ? 1 : 0));
		// t.is(matrix.getRow(0),1)
		t.notThrows(() => {
			all1(matrix.getRow(0));
		});

		row.forEach((v, i) => matrix.set(i, 1, v));
		t.notThrows(() => {
			diff(matrix.getRow(1), row);
		});

		row.forEach((v, i) => matrix.set(i, 4, v));
		t.notThrows(() => {
			diff(matrix.getRow(4), row);
		});
	});

	test.serial(`[${name}] .setRow`, t => {
		t.plan(4);
		let x = 30,
			y = 5;
		let matrix = new Matrix(x, y, 1);
		let row = new Array(x).fill(1).map((v, i) => (i % 3 ? 1 : 0));

		matrix.setRow(0, row);
		t.notThrows(() => {
			diff(getRow(matrix, 0), row);
		});

		matrix.setRow(1, row);
		t.notThrows(() => {
			// console(getRow(matrix, 1),row);
			diff(getRow(matrix, 1), row);
		});

		matrix.setRow(4, row);
		t.notThrows(() => {
			diff(getRow(matrix, 4), row);
		});

		matrix.fill(1);
		matrix.setRow(0, [0, 0]);
		let _row = new Array(x).fill(1);
		_row.splice(0, 2, ...[0, 0]);

		t.notThrows(() => {
			diff(getRow(matrix, 0), _row);
			// [0, 0, 1, 1, 1].forEach((v, x) => {
			// 	if (v !== matrix.get(x, 0)) throw 'err';
			// });
		});
	});

	test.serial(`[${name}] .getColumn`, t => {
		t.plan(3);
		let matrix = new Matrix(5, 5, 1);
		let row = [1, 0, 1, 1, 0];

		// t.is(matrix.getRow(0),1)
		t.notThrows(() => {
			all1(matrix.getColumn(0));
		});

		row.forEach((v, i) => matrix.set(1, i, v));
		t.notThrows(() => {
			diff(matrix.getColumn(1), row);
		});

		row.forEach((v, i) => matrix.set(4, i, v));
		t.notThrows(() => {
			diff(matrix.getColumn(4), row);
		});
	});

	test.serial(`[${name}] .setColumn`, t => {
		t.plan(4);
		let matrix = new Matrix(5, 5, 1);
		let row = [1, 0, 1, 1, 0];

		matrix.setColumn(0, row);
		t.notThrows(() => {
			diff(getColumn(matrix, 0), row);
		});

		matrix.setColumn(1, row);
		t.notThrows(() => {
			diff(getColumn(matrix, 1), row);
		});
		matrix.setColumn(4, row);
		t.notThrows(() => {
			diff(getColumn(matrix, 4), row);
		});

		matrix.fill(1);
		matrix.setColumn(0, [0, 0]);
		t.notThrows(() => {
			[0, 0, 1, 1, 1].forEach((v, y) => {
				if (v !== matrix.get(0, y)) throw 'err';
			});
		});
	});

	test.serial(`[${name}] .cellForEach`, t => {
		t.plan(4);
		let width = 5,
			height = 5;
		let matrix = new Matrix(width, height, 0);
		let _x = 0,
			_y = 0;
		let count = 0;
		t.notThrows(() => {
			matrix.cellForEach((v, x, y) => {
				count++;
				if (v !== 0 || x !== _x || y !== _y) throw '未通过';
				if (++_x == width) {
					_x = 0;
					_y++;
				}
			});
		});
		t.is(count, width * height);
		matrix.fill(1);
		_x = 0;
		_y = 0;
		count = 0;
		t.notThrows(() => {
			matrix.cellForEach((v, x, y) => {
				count++;
				if (v !== 1 || x !== _x || y !== _y) throw '未通过';
				if (++_x == width) {
					_x = 0;
					_y++;
				}
			});
		});
		t.is(count, width * height);
	});
}

// testFn(allClass[3]);
allClass.forEach(C => {
	testFn(C);
	noSize(C);
	testSize(C, view11, '1*1');
	testSize(C, view22, '2*2');
	testSize(C, view55, '5*5');
	testOther(C);
});
