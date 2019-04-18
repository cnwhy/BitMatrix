import Benchmark from 'benchmark';
// import { AnyMatrix, AnyMatrixUseObject, Uint8Matrix, BitMatrix } from '../../src/index';
import { typicalClass as cs } from '../import';
// const typicalClass = [
// 	AnyMatrix,AnyMatrixUseObject
// ]
// console.log(cs[2] == AnyMatrix);

const typicalClass = cs;
// const typicalClass = [BitMatrix, Uint8Matrix, AnyMatrix, AnyMatrixUseObject];
function getSuite() {
	return new Benchmark.Suite()
		.on('cycle', function(event) {
			console.log(String(event.target));
		})
		.on('complete', function() {
			console.log(
				'\nThe fastest: ' +
					this.filter('fastest').map(v => {
						return v.name;
					}),
				'\n'
			);
			end.push(this.filter('fastest').map(v => v.name));
		});
}

const suite = getSuite();
const suite1 = getSuite();
const suite2 = getSuite();
const suite3 = getSuite();
const suite4 = getSuite();

const x = 1000,
	y = 1000;

const points = [];
points.push([0, 0]);
points.push([(x / 2) >> 0, 0]);
points.push([(x - 1) >> 0, 0]);
points.push([0, (y / 2) >> 0]);
points.push([(x / 2) >> 0, (y / 2) >> 0]);
points.push([(x - 1) >> 0, (y / 2) >> 0]);
points.push([0, y - 1]);
points.push([(x / 2) >> 0, y - 1]);
points.push([(x - 1) >> 0, y - 1]);

let matrixs = typicalClass.map(v => new v(x, y));

// allClass.map(v=>{
// 	suite.add('new '+v['name'], function() {
// 		new v(x, y);
// 	})
// })
matrixs.map((v, i) => {
	let name = typicalClass[i]['className'] || typicalClass[i]['name'];
	let emptyFn = function() {};
	// suite.add('fill ' + name, function() {
	// 	v.fill(0);
	// });
	// suite1.add('get ' + name, function() {
	// 	get(v);
	// });
	// suite2.add('set ' + name, function() {
	// 	set(v, 1);
	// });
	suite3.add('forEach ' + name, function() {
		v.cellForEach(emptyFn);
	});
});

function set(obj, v) {
	for (let [x, y] of points) {
		obj.set(x, y, v);
	}
}
function get(obj) {
	for (let [x, y] of points) {
		obj.get(x, y);
	}
}

let end = [];
function runSuite(suite) {
	return new Promise((yes, no) => {
		suite.on('complete', yes).run({ async: false });
	});
}

Promise.resolve()
	// .then(x => runSuite(suite))
	// .then(x => runSuite(suite2))
	// .then(x => runSuite(suite1))
	.then(x => runSuite(suite3))
	.then(x => console.log(end));

// runSuite(suite);
// runSuite(suite1);
// runSuite(suite2);
