//需要 --expose-gc 启动
const { allClass } = require('../import');

// const defn = 21172224; //node常驻内存大小
const defn = process.memoryUsage().rss; //node常驻内存大小
const x = 100, y = 100, newcount= 1000;
function newfn(_class){
	global.gc();
	let arr = [];
	let max = newcount;
	while(max--){
		arr.push(new _class(x,y,true));
	}
	let men = process.memoryUsage();
	return {
		name: _class.name,
		// ...men
		rss: ((men.rss - defn)/1024/1024).toFixed(2)+'MB'
		// rss: ((men.rss)/1024/1024).toFixed(2)+'MB'
	}
}
let jg = allClass.map(M=>{
	return newfn(M);	
})
console.log(jg);
// let name = '';
// if(arg ==  '0'){
// 	name = 'MatrixArray'
// 	newfn(MatrixArray)
// }else if(arg ==  '1'){
// 	name = 'Uint8Class'
// 	newfn(Uint8Class)
// }else if(arg == '2'){
// 	name = 'ArrayClass'
// 	newfn(ArrayClass)
// }else if(arg == '3'){
// 	name = 'ObjClass'
// 	newfn(ObjClass)
// }else if(arg == '4'){
// 	name = 'MapClass'
// 	newfn(MapClass)
// }else{
// 	name = 'null'
// 	// newfn(MatrixArray)
// }

// var men = process.memoryUsage();
// console.log(name,((men.rss - defn)/1024/1024).toFixed(2)+'MB')
// console.log(men);