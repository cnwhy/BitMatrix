import Benchmark from 'benchmark';
import {
	BitMatrix,
	Uint8Matrix,
	Uint32Matrix,
	Float64Matrix,
	AnyMatrix,
	AnyMatrixUseObject,
} from '../../src/index';
// import { typicalClass as cs, allClass } from '../import';
import cluster from 'cluster';


const AClass = [
	BitMatrix, 
	Uint8Matrix, 
	Uint32Matrix, 
	Float64Matrix, 
	AnyMatrix,
	AnyMatrixUseObject,
];
//只执行指定测试;
const tests = ['fill', 'get', 'set', 'cellForEach'];
const JG = {}; // 收集结果;

// 基准测试组

const x = 1000;
const y = 1000;

async function runwork(index) {
	const worker = cluster.fork();
	worker.send(index);
	return new Promise((reslove, reject) => {
		worker.on('exit', (code, signal) => {
			reslove();
		});
	});
}

async function main() {
	let works = 0;
	let endTaskNum = 0;
	let JG = [];
	cluster.on('message', (worker, message, handle) => {
		// console.log(`[Master]# Worker ${worker.id}: ${message}`);
		let json = JSON.parse(message);
		// JG.push(json);
		JG = JG.concat(json);
		endTaskNum++;
		if (endTaskNum === works) {
			console.log(`操作同为 ${x + '*' + y} 矩阵, 基础方法的QPS比较: `);
			console.table(JG);
			cluster.disconnect();
		}
	});
	works += AClass.length;
	works += 2;
	for (let i = 0; i < AClass.length; i++) {
		await runwork(i);
	}
	await runwork('arr1');
	await runwork('arr2');
}



if (cluster.isMaster) {
	main();
} else {
	let S;
	function getSuite(jobname) {
		// 判断是否需要测试
		if (!tests.includes(jobname)) return { add: function() {} };

		// 判断是否已创建 suite
		// if (Suites[jobname]) return Suites[jobname];
		if (S) return S;
		return (S = new Benchmark.Suite()
			// return (SuiteList[SuiteList.length] = new Benchmark.Suite()
			.on('cycle', function(event: any) {
				// let name = event.name;
				let [a, b] = event.target.name.split('#');
				var hz = event.target.hz;
				JG[a][b] = hz;

				console.log(event.target.toString());
			})
			.on('complete', function(this: any) {
				// console.log('');
				// console.log(
				// 	'\nThe fastest: ' +
				// 		this.filter('fastest').map(v => {
				// 			return v.name;
				// 		}),
				// 	'\n'
				// );
			}));
	}
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

	process.on('message', seq => {
		if(seq == 'arr2'){
			let name = 'number[][]';
			let emptyFn = function(x, y, v) {};
			JG[name] = {};

			//初始化二维数组
			let M = [];
			let Y = y;
			while (Y--) {
				// M.push(new Array(x).fill(0));
				M.push(new Array(x).fill(0));
			}
			getSuite('fill').add(`${name}#fill`, function() {
				M.forEach(row => {
					row.fill(1);
				});
			});
			getSuite('get').add(`${name}#get`, function() {
				get_arr(M);
			});
			getSuite('set').add(`${name}#set`, function() {
				set_arr(M, 1);
			});
			getSuite('cellForEach').add(`${name}#cellForEach`, function() {
				for (let _y = 0; _y < y; _y++) {
					for (let _x = 0; _x < x; _x++) {
						emptyFn(M[_y][_x], x, y);
					}
				}
			});
		}else if(seq == 'arr1'){
			let name = 'number[]';
			let emptyFn = function(x, y, v) {};
			JG[name] = {};

			//初始化一维数组
			let M = new Array(x * y).fill(0);

			getSuite('fill').add(`${name}#fill`, function() {
				M.fill(1);
			});
			getSuite('get').add(`${name}#get`, function() {
				get_arr1(M);
			});
			getSuite('set').add(`${name}#set`, function() {
				set_arr1(M, 1);
			});
			getSuite('cellForEach').add(`${name}#cellForEach`, function() {
				let count = x * y;
				let _x = 0,
					_y = 0;
				for (let i = 0; i < count; i++) {
					emptyFn(M[i], _x, _y);
					if (++_x == x) {
						_x = 0;
						_y++;
					}
				}
			});
		}else{
			let testClass = [AClass[+seq]];
			let matrixs = testClass.map(v => new v(x, y, 0));
			matrixs.map((v, i) => {
				let name = testClass[i]['className'] || testClass[i]['name'];
				let emptyFn = function(a, b, c) {};
				JG[name] = {};
				getSuite('fill').add(`${name}#fill`, function() {
					v.fill(1);
				});
				getSuite('get').add(`${name}#get`, function() {
					get(v);
				});
				getSuite('set').add(`${name}#set`, function() {
					set(v, 1);
				});
				getSuite('cellForEach').add(`${name}#cellForEach`, function() {
					v.cellForEach(emptyFn);
				});
			});
		}
		
		function set(obj, v) {
			for (let [_x, _y] of points) {
				obj.set(_x, _y, v);
			}
		}
		function get(obj) {
			for (let [_x, _y] of points) {
				let a = obj.get(_x, _y);
			}
		}

		function set_arr(obj, v) {
			for (let [_x, _y] of points) {
				obj[_y][_x] = v;
			}
		}

		function get_arr(obj) {
			for (let [_x, _y] of points) {
				let a = obj[_y][_x];
			}
		}

		function set_arr1(obj, v) {
			for (let [_x, _y] of points) {
				obj[_y * x + _x] = v;
			}
		}

		function get_arr1(obj) {
			for (let [_x, _y] of points) {
				let a = obj[_y * x + _x];
			}
		}

		function runSuite() {
			return new Promise((yes, no) => {
				S.on('complete', yes).run({ async: true });
			});
		}

		

		Promise.resolve()
			.then(runSuite)
			.then(() => {
				let jgArr = [];
				for (let k in JG) {
					let _jg = {};
					for (let v in JG[k]) {
						var _n = JG[k][v];
						JG[k][v] = _n > 1000 ? (_n / 1000).toFixed(2) + 'K' : _n.toFixed(2);
					}
					jgArr.push(Object.assign({ name: k }, JG[k]));
				}
				//把结果发送给主线程进行汇总;
				process.send(JSON.stringify(jgArr));
			})
			.catch(console.error).finally(process.exit);
	});
}
