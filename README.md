# BitMatrix
[![Coverage Status](https://coveralls.io/repos/github/cnwhy/BitMatrix/badge.svg?branch=master)](https://coveralls.io/github/cnwhy/BitMatrix?branch=master)
[![Build Status](https://travis-ci.org/cnwhy/BitMatrix.svg?branch=master)](https://travis-ci.org/cnwhy/BitMatrix)
> **BitMatrix** 以 `ArrayBuffer` 为基础, 以 `bit` 为单元的矩阵类实现;

**特点如下:**  
1. 按需选择矩阵类,节省内存;
2. 统一API方便矩阵操作;
3. 支持将矩阵对像通过 `base64` 导入导出, 打通存储问题;

**适用场景:**  
任何需要存储点阵信息的场景;

**类说明:**  
> 除了 `ArrayBuffer` 做存储的矩阵, 还提供 `AnyMatrix`, `AnyMatrixUseObject` 两个类;  
> 这两个类主要用于做为参照物; 也可以做为可以存储任意值的矩阵来使用; API相同

class | base DataView | value range 
-- | -- | --
BitMatrix | - | `0` / `1`
Int8Matrix | Int8Array | Int8
Uint8Matrix | Uint8Array | Uint8
Uint8ClampedMatrix | Uint8ClampedArray | Uint8
Int16Matrix | Int16Array | Int16
Uint16Matrix | Uint16Array | Uint16
Int32Matrix | Int32Array | Int32
Uint32Matrix | Uint32Array | Uint32
Float32Matrix | Float32Array | Float32
Float64Matrix | Float64Array | Float64
AnyMatrix | Array | any
AnyMatrixUseObject | Object | any

**内存占用**
> 从以下的表格看, 是符合预期的
```
用 1 填充 2000 个 100*100 矩阵 内存占用情况:
┌─────────┬──────────────────────┬────────────┬────────────┬────────────┐
│ (index) │      className       │  heapUsed  │  external  │    sum     │
├─────────┼──────────────────────┼────────────┼────────────┼────────────┤
│    0    │     'BitMatrix'      │  '0.77MB'  │  '2.38MB'  │  '3.16MB'  │
│    1    │     'Int8Matrix'     │  '0.87MB'  │ '19.07MB'  │ '19.94MB'  │
│    2    │    'Uint8Matrix'     │  '0.82MB'  │ '19.07MB'  │ '19.89MB'  │
│    3    │ 'Uint8ClampedMatrix' │  '0.82MB'  │ '19.07MB'  │ '19.89MB'  │
│    4    │    'Int16Matrix'     │  '0.81MB'  │ '38.15MB'  │ '38.96MB'  │
│    5    │    'Uint16Matrix'    │  '0.68MB'  │ '38.15MB'  │ '38.83MB'  │
│    6    │    'Int32Matrix'     │  '0.53MB'  │ '76.29MB'  │ '76.82MB'  │
│    7    │    'Uint32Matrix'    │  '0.49MB'  │ '76.29MB'  │ '76.79MB'  │
│    8    │   'Float32Matrix'    │  '0.53MB'  │ '76.29MB'  │ '76.82MB'  │
│    9    │   'Float64Matrix'    │  '0.49MB'  │ '152.59MB' │ '153.08MB' │
│   10    │     'AnyMatrix'      │ '153.59MB' │  '0.00MB'  │ '153.59MB' │
│   11    │ 'AnyMatrixUseObject' │ '154.00MB' │  '0.00MB'  │ '154.00MB' │
└─────────┴──────────────────────┴────────────┴────────────┴────────────┘
```

**基准测试**
> BitMatrix 虽然要增加`字节`到`位`的处理 但是在测试看来速度还不错.
```
fill BitMatrix x 195,429 ops/sec ±5.24% (82 runs sampled)
fill Uint8Matrix x 22,878 ops/sec ±6.01% (78 runs sampled)
fill AnyMatrix x 956 ops/sec ±3.05% (78 runs sampled)
fill AnyMatrixUseObject x 83.68 ops/sec ±2.66% (69 runs sampled)

set BitMatrix x 8,610,146 ops/sec ±3.74% (82 runs sampled)
set Uint8Matrix x 15,196,501 ops/sec ±1.75% (84 runs sampled)
set AnyMatrix x 14,673,531 ops/sec ±1.17% (89 runs sampled)
set AnyMatrixUseObject x 15,393,786 ops/sec ±0.91% (86 runs sampled)

get BitMatrix x 9,496,652 ops/sec ±2.15% (85 runs sampled)
get Uint8Matrix x 15,714,307 ops/sec ±2.69% (87 runs sampled)
get AnyMatrix x 14,934,005 ops/sec ±1.14% (91 runs sampled)
get AnyMatrixUseObject x 16,632,619 ops/sec ±0.82% (88 runs sampled)

forEach BitMatrix x 720 ops/sec ±2.01% (85 runs sampled)
forEach Uint8Matrix x 900 ops/sec ±2.68% (83 runs sampled)
forEach AnyMatrix x 84.17 ops/sec ±0.76% (69 runs sampled)
forEach AnyMatrixUseObject x 970 ops/sec ±0.49% (91 runs sampled)
```

## 使用
```js
import BitMatrix from 'bitmatrix';
//or
import {BitMatrix, Uint8Matrix, AnyMatrix} from 'bitmatrix/es/' 

let bm = new BitMatrix(2,2,0);
let bm1 = BitMatrix.from([[1,0],[1,0]]);
let bm2 = BitMatrix.from([1,0,1,0],2);
```

## API
> API 可能还会有变化, 欢迎提意见. 
```typescript
class Matrix {
	constructor(width: number, height: number, defaultValue?: any);
	//宽
	width: number;
	//高
	height: number;
	//单元格总数
	total: number;
	// 填充矩阵
	fill(value: any);
	// 填充一行
	fillRow(row: number, value: any);
	// 填充一列
	fillColumn(column: number, value: any);
	// 读取指定单元格
	get(x: number, y: number): any;
	// 设置指定单元格
	set(x: number, y: number, value: any);
	// 读取一行 返回 Array
	getRow(y: number): any[];
	// 设置一行 返回 Array
	setRow(y: number, row:any[]);
	// 读取一列 返回 Array
	getColumn(x: number): any[];
	// 设置一列 返回 Array
	setColumn(x: number, column: any[]);
	// 暴露矩阵原型数据对像, 如果你不清楚是什么, 请勿使用
	getPrototypeData():Object;
	// 遍历矩阵
	cellForEach(fn: (value: any, x: number, y: number) => void);
	// 以','分隔列, '\n'分隔行, 返回当前矩阵数据
	showView(): string;
	// 创建一个副本
	clone(): Matrix;
	// 用现有数据创建矩阵
	static from(arr:[][]): Matrix;
	static from(arr:[],width:number): Matrix;
	// 用现有矩阵对像 创建一个此类型的矩阵对象 注意区别clone(); from可以创建不能类型的矩阵
	static from(matrix:Matrix,callback:(value: any, x: number, y: number)=>any,thisArg): Matrix;
	// 通过base64导出矩阵,便于存储
	static output(matrix:Matrix): string;
	// 通过导入base64,创建矩阵
	static input(base64:string): Matrix;
}
```
#### 复制矩阵
推荐使用矩阵对像的 `clong()` 方法;  

#### 导入导出 
> 为获取最大兼容,选用 `base64` 为媒介进行导入(`input()`), 导出(`output()`);

**二进制结构说明(暂定):**  
前9个字节为描述字节, 后面为数据字节;
<table border="1">
<tr><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td></td><td></td></tr>
<tr>
	<td colspan=4>Uint32LE(width)</td>
	<td colspan=4>Uint32LE(height)</td>
	<td colspan=1>Uint8(typeMark)</td>
	<td colspan=12>...(data)</td>
</tr>
</table>


```js
import BitMatrix from 'bitmatrix';
let bm = new BitMatrix(7,7,0);
bm.fillColumn(3,1);
bm.fillRow(3,1);

let b64 = BitMatrix.output(bm);
console.log(b64);
let bm1 = BitMatrix.input(b64);
console.log(bm1.showView())

/*
AAAABwAAAAcDCATij0AgAA==
0,0,0,1,0,0,0
0,0,0,1,0,0,0
0,0,0,1,0,0,0
1,1,1,1,1,1,1
0,0,0,1,0,0,0
0,0,0,1,0,0,0
0,0,0,1,0,0,0
*/
```


## Other
- [x] 添加各API参数合法性检测
- 处理好 单元测试, 基准测试, 内存测试代码;
	- [x] 单元测试
	- [x] 基准测试
	- [x] 内存占用测试
- [ ] 增加基准测试范围;
- Matrix.from(arr:[][]|[][,width])
	- [x] 编码
	- [x] 测试
- .clone()
	- [x] 编码
	- [x] 测试
- .copy() .copyTo()
	- [ ] copy()
	- [ ] copyTo()
- 装箱, 拆箱;
	- [ ] typeBuffer Matrix 转 base64
	- [ ] base64 转 Matrix 