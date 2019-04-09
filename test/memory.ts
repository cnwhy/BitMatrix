import v8 from "v8";
import vm from 'vm';
import { allClass } from './import';

// 配制GC模式 方便检查内存
v8.setFlagsFromString('--expose_gc --gc_global --always_compact');
global.gc = vm.runInNewContext('gc');

const x = 100, y = 100, newcount= 2000;
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
	while(max--){
		arr.push(new _class(x,y,1));
	}
	let mem = process.memoryUsage();
	return {
		className: _class.className || _class.name,
		... diffMore(mem_old,mem)
	}
}
let jg = allClass.map(M=>{
	return newfn(M);	
})
console.log(`用 1 填充 ${newcount} 个 ${x+'*'+y} 矩阵 内存占用情况:`)
console.table(jg);