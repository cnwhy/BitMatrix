// 内存占用测试
import v8 from "v8";
import vm from 'vm';
import { allClass } from './import';
// import 'console.table';
// 配制GC模式 方便检查内存
v8.setFlagsFromString('--expose_gc --gc_global --always_compact');
global.gc = vm.runInNewContext('gc');

const x = 100, y = 100, v = 1, newcount= 2000;

function diffMore(m1,m2){
	function toMB(x){
		return (x/1024/1024).toFixed(2)+'MB'
	}
	return {
		// rss: toMB(m2.rss - m1.rss),
		// heapTotal: toMB(m2.heapTotal - m1.heapTotal),
		heapUsed: toMB(m2.heapUsed - m1.heapUsed),
		external: toMB(m2.external - m1.external),
		sum: toMB(m2.heapUsed + m2.external - m1.heapUsed - m1.external)
	}
}

function newfn(_class){
	global.gc();
	let mem_old = process.memoryUsage();
	let arr = [];
	let max = newcount;
	let t1 = Date.now();
	while(max--){
		arr.push(new _class(x,y,v));
	}
	let t2 = Date.now();
	let mem = process.memoryUsage();
	return {
		className: _class.className || _class.name,
		... diffMore(mem_old,mem),
		time: t2-t1,
	}
}
let jg = allClass.map(M=>{
	return newfn(M);	
})

function m_array1(){
	global.gc();
	let mem_old = process.memoryUsage();
	let arr = [];
	let max = newcount;
	let t1 = Date.now();
	while(max--){
		arr.push(new Array(x*y).fill(v));
	}
	let t2 = Date.now();
	let mem = process.memoryUsage();
	return {
		className: 'number[]',
		... diffMore(mem_old,mem),
		time: t2-t1,
	}
}

function m_array2(){
	global.gc();
	let mem_old = process.memoryUsage();
	let arr = [];
	let max = newcount;
	let t1 = Date.now();
	while(max--){
		let _y = y;
		let M = []
		while(_y--){
			M.push(new Array(x).fill(v));
		}
		arr.push(M);
	}
	let t2 = Date.now();
	let mem = process.memoryUsage();
	return {
		className: 'number[][]',
		... diffMore(mem_old,mem),
		time: t2-t1,
	}
}
jg.push(m_array1());
jg.push(m_array2());

let jg_a = jg[jg.length-1];
// let a_sum = jg.reduce((_sum,a)=>Math.max(parseFloat(a.sum),_sum),0)
let a_sum = parseFloat(jg_a.sum);
let a_time = jg_a.time;

jg = jg.map((o:any)=>{
	o.sum += ' | ' + (parseFloat(o.sum)/a_sum*100).toFixed(2) + "%";
	o.time += ' | ' + (o.time/a_time*100).toFixed(2) + "%";
	return o;
})

console.table || (console.table = console.log);
console.log(`生成 ${newcount} 个 ${x+'*'+y} 矩阵, 并用 ${v} 填充, 内存及耗时占用情况:`)
console.table(jg);