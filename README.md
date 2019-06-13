# BitMatrix
[![Coverage Status](https://coveralls.io/repos/github/cnwhy/BitMatrix/badge.svg?branch=master)](https://coveralls.io/github/cnwhy/BitMatrix?branch=master)
[![Build Status](https://travis-ci.org/cnwhy/BitMatrix.svg?branch=master)](https://travis-ci.org/cnwhy/BitMatrix)
> **BitMatrix** 以 `ArrayBuffer` 为基础, 以 `bit` 为单元的矩阵类实现;

**特性:**  
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
BitMatrix | <Bit> | `0` / `1`
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

## 安装
```
npm i bitmatrix
```

## 使用
**nodejs**
```js
const BitMatrix = require('bitmatrix').BitMatrix;
//使用其它的矩阵类
//const {BitMatrix, Uint8Matrix, AnyMatrix} = require('bitmatrix');
let bm = new BitMatrix(2,2,0); //初始化一个以 0 填充的 2*2 矩阵 
console.log(bm.showView());
```

**ES2015**
```js
// 默认导出 BitMatrix 类
import BitMatrix from 'bitmatrix'; 
//使用其它的矩阵类
//import {BitMatrix, Uint8Matrix, AnyMatrix} from 'bitmatrix' 
console.log(bm.showView());
```
**浏览器**
浏览器使用时可选择 己打包依赖的文件 `./dist/BitMatrix.umd.js`
```html
<script src="//unpkg.com/@cnwhy/base64/dist/BitMatrix.umd.js"></script>
```

## API
> API 可能还会有变化, 欢迎提意见. 
```typescript
class Matrix {
	constructor(width: number, height: number, defaultValue?: any);
	//宽(只读)
	width: number;
	//高(只读)
	height: number;
	//单元格总数(只读)
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

### 复制矩阵
推荐使用矩阵对像的 `clone()` 方法;  

### 导入导出 
> 为获取最大兼容,选用 `base64` 为媒介进行导入(`input()`), 导出(`output()`);

**导入/导出的数据结构:**  
前9个字节为描述字节, 后面为数据;
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

## 兼容
> 基于 `BufferArray` 只能运行于支持 `ES2015` 的环境;

## 性能测试
### 内存占用 `node v10.13.0`
从以下的表格看, 是符合预期的.
```
生成 2000 个 100*100 矩阵, 并用 1 填充, 内存及耗时占用情况:
┌─────────┬──────────────────────┬────────────┬────────────┬──────────────────────┬───────────────────┐
│ (index) │      className       │  heapUsed  │  external  │         sum          │       time        │
├─────────┼──────────────────────┼────────────┼────────────┼──────────────────────┼───────────────────┤
│    0    │     'BitMatrix'      │  '0.77MB'  │  '2.38MB'  │   '3.16MB | 1.91%'   │    '7 | 1.46%'    │
│    1    │     'Int8Matrix'     │  '0.87MB'  │ '19.07MB'  │  '19.94MB | 12.07%'  │   '16 | 3.33%'    │
│    2    │    'Uint8Matrix'     │  '0.82MB'  │ '19.07MB'  │  '19.90MB | 12.04%'  │   '14 | 2.92%'    │
│    3    │ 'Uint8ClampedMatrix' │  '0.82MB'  │ '19.07MB'  │  '19.89MB | 12.04%'  │   '15 | 3.13%'    │
│    4    │    'Int16Matrix'     │  '0.80MB'  │ '38.15MB'  │  '38.95MB | 23.57%'  │   '17 | 3.54%'    │
│    5    │    'Uint16Matrix'    │  '0.68MB'  │ '38.15MB'  │  '38.83MB | 23.50%'  │   '19 | 3.96%'    │
│    6    │    'Int32Matrix'     │  '0.53MB'  │ '76.29MB'  │  '76.82MB | 46.49%'  │  '147 | 30.63%'   │
│    7    │    'Uint32Matrix'    │  '0.53MB'  │ '76.29MB'  │  '76.82MB | 46.49%'  │  '139 | 28.96%'   │
│    8    │   'Float32Matrix'    │  '0.53MB'  │ '76.29MB'  │  '76.82MB | 46.49%'  │  '140 | 29.17%'   │
│    9    │   'Float64Matrix'    │  '0.49MB'  │ '152.59MB' │ '153.08MB | 92.64%'  │  '286 | 59.58%'   │
│   10    │     'AnyMatrix'      │ '153.61MB' │  '0.00MB'  │ '153.61MB | 92.96%'  │ '2445 | 509.38%'  │
│   11    │ 'AnyMatrixUseObject' │ '153.75MB' │  '0.00MB'  │ '153.75MB | 93.05%'  │ '6056 | 1261.67%' │
│   12    │      'number[]'      │ '153.13MB' │  '0.00MB'  │ '153.13MB | 92.67%'  │ '2808 | 585.00%'  │
│   13    │     'number[][]'     │ '165.24MB' │  '0.00MB'  │ '165.24MB | 100.00%' │  '480 | 100.00%'  │
└─────────┴──────────────────────┴────────────┴────────────┴──────────────────────┴───────────────────┘
```
> 可执行 `npm run test-memory` 命令测试, 获取本结果;

### 基准测试 `node v10.13.0`
```
操作同为 1000*1000 矩阵, 基础方法的QPS比较: 
┌─────────┬─────────────────┬───────────┬─────────────┬─────────────┬─────────────┐
│ (index) │      name       │   fill    │     get     │     set     │ cellForEach │
├─────────┼─────────────────┼───────────┼─────────────┼─────────────┼─────────────┤
│    0    │   'BitMatrix'   │ '210.31K' │ '8194.21K'  │ '6275.51K'  │  '700.17'   │
│    1    │  'Uint8Matrix'  │ '25.63K'  │ '10969.26K' │ '9658.56K'  │  '991.44'   │
│    2    │ 'Uint32Matrix'  │  '2.66K'  │ '11844.04K' │ '10304.60K' │  '992.45'   │
│    3    │ 'Float64Matrix' │  '1.19K'  │ '11845.38K' │ '10639.79K' │  '988.99'   │
│    4    │   'AnyMatrix'   │  '1.23K'  │ '11453.06K' │ '10560.18K' │  '987.83'   │
│    5    │   'number[]'    │  '1.15K'  │ '15009.22K' │ '14345.48K' │  '960.72'   │
│    6    │  'number[][]'   │ '752.19'  │ '12196.47K' │ '11029.79K' │   '1.48K'   │
└─────────┴─────────────────┴───────────┴─────────────┴─────────────┴─────────────┘
```
> `get` 与 `set` 测试都使用了9个点, 所以真实值应该再乘上9;  
> 可执行 `npm run test-benchmark` 命令, 获取本结果;


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
- 导出, 导入;
	- [x] typeBuffer Matrix 转 base64
	- [x] base64 转 Matrix 