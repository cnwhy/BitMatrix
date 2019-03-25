// var BM = require('../lib/BitMatrix').default;
var BM = require('../lib/AnyMatrix').default;

var m = new BM(10,5);
var m2 = new BM(10,5);
m.fill(0)
m.setRow(0,[1,0,1,0,0,1,0,0,0,1,0,0,0,0,1,1,1,1,0,0])
m2.setRow(0,[1,0,1,0,0,1,0,0,0,1,0,0,0,0,1,1,1,1,0,0])
console.log(m2.showView());
// m.setRow(4,[1,0,1,0,0,1,0,0,0,1,0,0,0,0,1,1,1,1,0,0])
// m.setColumn(0,[1,1,1,0,1])
// m.setColumn(19,[1,1,1,1,1])
// console.log(m.getRow(0));
// m.setRow(0,[1,0,1,0,1,0,0,1,1,0,0,0,1,0,0,1,1,1,1,1])
// console.log(m.getRow(0).join());
// console.log(m.getRow(1).join());
// console.log(m.getRow(2).join());
// console.log(m.getRow(3).join());
// console.log(m.getRow(4).join());

// console.log(m.showView());
// console.log('--------------')
// let i = 20
// while (i--) {
// 	console.log(m.getColumn(i))
// 	// console.log(m.getColumn(i).join());	
// }


console.log('--------------')
console.log(m.showView());