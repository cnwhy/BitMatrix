const { allClass } = require('./import');

// const allClass = [require('../lib/AnyMatrixUseObject').default];

const x = 10,
	y = 10;

const oneIndex = [[0, 0], [5, 0], [9, 0], [0, 5], [5, 5], [9, 5], [0, 9], [5, 9], [9, 9]];

const s0 = (function() {
	var arr = [];
	for (let _y = 0; _y < y; _y++) {
		for (let _x = 0; _x < x; _x++) {
			arr.push([_x, _y, 0].join(','));
		}
	}
	return arr.join('|') + '|';
})();
// '0,0,0|1,0,0|2,0,0|3,0,0|4,0,0|5,0,0|6,0,0|7,0,0|8,0,0|9,0,0|0,1,0|1,1,0|2,1,0|3,1,0|4,1,0|5,1,0|6,1,0|7,1,0|8,1,0|9,1,0|0,2,0|1,2,0|2,2,0|3,2,0|4,2,0|5,2,0|6,2,0|7,2,0|8,2,0|9,2,0|0,3,0|1,3,0|2,3,0|3,3,0|4,3,0|5,3,0|6,3,0|7,3,0|8,3,0|9,3,0|0,4,0|1,4,0|2,4,0|3,4,0|4,4,0|5,4,0|6,4,0|7,4,0|8,4,0|9,4,0|0,5,0|1,5,0|2,5,0|3,5,0|4,5,0|5,5,0|6,5,0|7,5,0|8,5,0|9,5,0|0,6,0|1,6,0|2,6,0|3,6,0|4,6,0|5,6,0|6,6,0|7,6,0|8,6,0|9,6,0|0,7,0|1,7,0|2,7,0|3,7,0|4,7,0|5,7,0|6,7,0|7,7,0|8,7,0|9,7,0|0,8,0|1,8,0|2,8,0|3,8,0|4,8,0|5,8,0|6,8,0|7,8,0|8,8,0|9,8,0|0,9,0|1,9,0|2,9,0|3,9,0|4,9,0|5,9,0|6,9,0|7,9,0|8,9,0|9,9,0|';

let matrixs = allClass.map(M => new M(x, y));

let vs = matrixs.map((m, i) => {
	console.log(allClass[i].name);
	let s = '';
	m.fill(0);
	m.cellForEach((v, x, y) => {
		s += [x, y, v].join(',') + '|';
	});
	if (s !== s0) throw allClass[i].name + ' mark1';
	s = '';
	oneIndex.forEach(([x, y]) => {
		m.set(x, y, 1);
	});
	m.cellForEach((v, x, y) => {
		s += [x, y, v].join(',') + '|';
	});
	return s;
});

let copyMs = [];
allClass.map((M, i) => {
	// console.log('11111111111111')
	let om = matrixs[i];
	let m = new M(x, y);
	let m2 = new M(x, y);

	for (let i = 0; i < x; i++) {
		m.setColumn(i, om.getColumn(i));
	}
	for (let i = 0; i < y; i++) {
		// console.log(m2.getRow(i))
		m2.setRow(i, om.getRow(i));
	}
	copyMs.push(m);
	copyMs.push(m2);
});

let getRC_setRC = copyMs.every((m, i) => {
	// console.log(m.showView());
	for (let index = 0; index < oneIndex.length; index++) {
		const [x, y] = oneIndex[index];
		if (m.get(x, y) !== 1) {
			// console.log(allClass[i].name);
			return false;
		}
	}
	return true;
});

let getpass = matrixs.every((m, i) => {
	for (let index = 0; index < oneIndex.length; index++) {
		const [x, y] = oneIndex[index];
		if (m.get(x, y) !== 1) {
			console.log(allClass[i].name);
			return false;
		}
	}
	return true;
});

let pass = vs.every((v, i) => {
	let pass = true;
	if (v != vs[0]) {
		console.log(allClass[i].name);
		console.log(v);
		pass = false;
	}
	return pass && v != '';
});

console.log('测试结果:', getpass && getRC_setRC && pass ? 'is ok' : 'is err');
return;
