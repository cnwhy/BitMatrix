const Benchmark = require('benchmark');

const max = 1000;

function for1(){
	let arr = [];
	let i = 0, _max = max;
	while (_max--) {
		arr[i++] = 1;
	}
	return arr
}
function for2(){
	let arr = [];
	let i = 0, _max = max;
	while (i < _max) {
		arr[i++] = 1;
	}
	return arr
}

function for3(){
	let arr = [];
	let i = 0, _max = max;
	for (; i < _max; i++) {
		arr[i] = 1;
	}
	return arr
}
console.log(for1().length)
console.log(for2().length)
console.log(for3().length)

const suite = new Benchmark.Suite().on('cycle', function(event) {
	console.log(String(event.target));
});


suite.add('loop2',function(){
	for2()
})
suite.add('loop3',function(){
	for3()
})
suite.add('loop1',function(){
	for1()
})

suite.on('complete', function() {
	console.log('\n最快的是: ' + this.filter('fastest').map('name'), '\n');
})
.run({ async: true });