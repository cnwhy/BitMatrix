import test from 'ava';
import { decode, encode, utf8Decode } from '../../src/Base64';

//正常字符
let strs = [
	['sfsf2342342*Y*&^&()*)','普通字符串'],
	['火车头aĉc','混合字符串1'],
	['123火车头aĉc','混合字符串2'],
	['123火车头aĉc车头','混合字符串3'],
	['a\u{10126}ĉc车头','带4字节的字符串']
];
let strs1 = [
	['a\ud812bc','非正常字符串1'],
]

function testFn(str, buffer, exp) {
	test.serial(`type string ${exp}`, t => {
		t.plan(3);
		t.true(typeof str === 'string');
		let b64 = encode(str);
		t.log(decode(b64),buffer);
		t.log(utf8Decode(decode(b64)),str);
	
		t.is(b64, buffer.toString('base64'));
		t.is(utf8Decode(decode(b64)),buffer.toString());
	});
	test.serial(`type buffer ${exp}`, t => {
		t.plan(3);
		t.true(buffer instanceof Buffer);
		let b64 = encode(buffer);
		t.is(b64, buffer.toString('base64'))
		t.is(utf8Decode(decode(b64)),buffer.toString());
	});
	test.serial(`type Array ${exp}`, t => {
		t.plan(3);
		let bf:number[] = Array.from(buffer);
		t.true(Array.isArray(bf));
		let b64 = encode(bf);
		t.is(b64, buffer.toString('base64'))
		let darr:number[] = Array.from(decode(b64));
		t.is(utf8Decode(darr),buffer.toString());
	});
	test.serial(`type Uint8Array ${exp}`, t => {
		t.plan(3);
		let bf = new Uint8Array(Array.from(buffer));
		t.true(bf instanceof Uint8Array);
		let b64 = encode(bf);
		t.is(b64, buffer.toString('base64'))
		t.is(utf8Decode(decode(b64)),buffer.toString());
	});
	test.serial(`type ArrayBuffer ${exp}`, t => {
		t.plan(3);
		let bf = new Uint8Array(Array.from(buffer));
		// console.log('=======',bf);
		t.true(bf.buffer instanceof ArrayBuffer);
		let b64 = encode(bf.buffer);
		t.is(b64, buffer.toString('base64'))
		t.is(utf8Decode(decode(b64)),buffer.toString());
	});
	
}

//非正常字符串 编码解码;
function testFn1(str, exp) {
	test.serial(`type ${exp}`, t => {
		let b64 = encode(str);
		t.is(utf8Decode(decode(b64)),str);
	});
}


strs.map(arr=>{
	let [str, exp]=arr;
	testFn(str,new Buffer(str),exp);
})

strs1.map(arr=>{
	let [str, exp]=arr;
	testFn1(str,exp);
})

test.serial(`decode 非正常base64字符串`, t => {
	t.plan(2);
	t.throws(()=>{
		decode('dfj}')
	})
	t.throws(()=>{
		decode('dfjaf')
	})
})

// test.serial(`2进制数据编码/解码`, t => {
// 	var bf = new Buffer(100);
// 	var bf1 = decode(encode(bf));
// 	t.deepEqual(Array.from(bf),Array.from(bf1));
// })

test.serial(`2进制数据编码/解码`, t => {
	var bf = new Buffer(100);
	for(let i=0; i<bf.length; i++){
		bf[i] = (Math.random() * 256) >> 0;
	}
	var bf1 = decode(encode(bf));
	t.deepEqual(Array.from(bf),Array.from(bf1));
})

test.serial(`乱码字符串编码/解码`, t => {
	var str = '';
	for(let i=0; i<10000; i++){
		str += String.fromCodePoint((Math.random() * 0x10FFFF) >> 0) ;
	}
	var str1 = utf8Decode(decode(encode(str)));
	t.is(str,str1);
	// t.deepEqual(Array.from(str),Array.from(bf1));
})


// test.serial(`encode 非正常字符串`, t => {
// 	t.plan(2);
// 	let str = "a\ud801\u{10046}cd"
// 	let b64 = encode(str);
// 	let str1 = utf8Decode(decode(b64));


// })
