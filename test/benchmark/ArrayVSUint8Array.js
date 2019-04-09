// import Benchmark from 'benchmark';

const Benchmark = require('benchmark');

suite = new Benchmark.Suite().on('cycle', function(event) {
	console.log(String(event.target));
});

const length = 1000

let arr = []
let u8 = new Uint8Array(1000)

let k = 0;
while (k<1000) {
	arr.push(k);
	u8[k] = k;
	k++;
}

// suite.add('Array fill',()=>{
// 	(new Array(length)).fill(255);
// })

// suite.add('Uint8Array fill',()=>{
// 	(new Int32Array(length)).fill(255);
// })

suite.add('Uint8Array get',()=>{
	let k = 0;
	while (k<1000) {
		let v = arr[k++];
	}
});

suite.add('Array get',()=>{
	let k = 0;
	while (k<1000) {
		let v = u8[k++];
	}
});

suite.on('complete', function() {
	// console.log(this);
	console.log('\n最快的是: ' + this.filter('fastest').map((v)=>{
		// console.log(Object.entries(v));
		return v.name;
	}), '\n');
})
.run({ async: true });