import Benchmark from 'benchmark';
import { typicalClass } from '../import';

const suite = new Benchmark.Suite().on('cycle', function(event) {
	console.log(String(event.target));
});
const suite1 = new Benchmark.Suite().on('cycle', function(event) {
	console.log(String(event.target));
});
const suite2 = new Benchmark.Suite().on('cycle', function(event) {
	console.log(String(event.target));
});
const suite3 = new Benchmark.Suite().on('cycle', function(event) {
	console.log(String(event.target));
});
const suite4 = new Benchmark.Suite().on('cycle', function(event) {
	console.log(String(event.target));
});

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
	let emptyFn = function(){};
	suite.add('fill ' + name, function() {
		v.fill(0);
	});
	suite1.add('get ' + name, function() {
		get(v);
	});
	suite2.add('set ' + name, function() {
		set(v, 1);
	});
	suite3.add('forEach ' + name, function() {
		v.cellForEach(emptyFn);
	});
});

function set(obj, v) {
	for (let [x, y] of points) {
		obj.set(x, y, v);
	}
	// for (let _y = 0; _y < y; _y++) {
	// 	for (let _x = 0; _x < x; _x++) {
	// 		obj.set(_x, _y, v);
	// 	}
	// }
}
function get(obj) {
	for (let [x, y] of points) {
		obj.get(x, y);
	}
	// for (let _y = 0; _y < y; _y++) {
	// 	for (let _x = 0; _x < x; _x++) {
	// 		obj.get(_x, _y);
	// 	}
	// }
}

let end = [];
function runSuite(suite) {
	return new Promise((yes, no) => {
		suite
			.on('complete', function(this) {
				// console.log(this);
				console.log('\n最快的是: ' + this.filter('fastest').map('name'), '\n');
				end.push(this.filter('fastest').map('name'));
				yes();
			})
			.run({ async: true });
	});
}

Promise.resolve()
	.then(x => runSuite(suite))
	// .then(x => runSuite(suite2))
	// .then(x => runSuite(suite1))
	.then(x => runSuite(suite3))
	.then(x => console.log(end));

// runSuite(suite);
// runSuite(suite1);
// runSuite(suite2);
