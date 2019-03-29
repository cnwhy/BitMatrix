# BitMatrix
> **BitMatrix** 以 `ArrayBuffer` 为基础, 以`bit` 为单位的矩阵类实现;

**特点如下**:  
1. BitMatrix只能存储 `1` 或者 `0`
2. 非常节约内存;
3. 速度不输以 `Array` 为基础的矩阵实现

**适用场景**:  
任何需要存储点阵信息的场景;

**类说明:**:  
> 除了 `ArrayBuffer` 做存储的矩阵, 还提供两个 `AnyMatrix`, `AnyMatrixUseObject` 两个类;  
> 这两个类主要用于做为参照物; 也可以做为可以存储任意值的矩阵来使用

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
│    1    │     'Int8Matrix'     │  '0.81MB'  │ '19.07MB'  │ '19.89MB'  │
│    2    │    'Uint8Matrix'     │  '0.68MB'  │ '19.07MB'  │ '19.75MB'  │
│    3    │ 'Uint8ClampedMatrix' │  '0.68MB'  │ '19.07MB'  │ '19.75MB'  │
│    4    │    'Int16Matrix'     │  '0.68MB'  │ '38.15MB'  │ '38.83MB'  │
│    5    │    'Uint16Matrix'    │  '0.68MB'  │ '38.15MB'  │ '38.83MB'  │
│    6    │    'Int32Matrix'     │  '0.49MB'  │ '76.29MB'  │ '76.79MB'  │
│    7    │    'Uint32Matrix'    │  '0.50MB'  │ '76.29MB'  │ '76.79MB'  │
│    8    │   'Float32Matrix'    │  '0.53MB'  │ '76.29MB'  │ '76.82MB'  │
│    9    │   'Float64Matrix'    │  '0.50MB'  │ '152.59MB' │ '153.09MB' │
│   10    │     'AnyMatrix'      │ '153.23MB' │  '0.00MB'  │ '153.23MB' │
│   11    │ 'AnyMatrixUseObject' │ '159.04MB' │  '0.00MB'  │ '159.04MB' │
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
## 兼容性
理论上支持`DataView`的浏览器都支持: 'IE10+'

## 使用
```js
import BitMatrix from `bitmatrix`;
//or
import {BitMatrix, Uint8Matrix, AnyMatrix} from 'bitmatrix/Matrix' 

/*
ts use: 
import BitMatrix from `BitMatrix`;
import {BitMatrix, Uint8Matrix, AnyMatrix} from 'BitMatrix/src'
*/

```

## API
> API 可能还会有变化, 欢迎提意见. 
```typescript
class Matrix {
	width: number;
	height: number;
	total: number;
	constructor(width: number, height: number, defaultValue?: any);
	fill(value: any);
	fillRow(row: number, value: any);
	fillColumn(column: number, value: any);
	get(x: number, y: number): any;
	set(x: number, y: number, value: any);
	getRow(y: number): any[];
	setRow(y: number, row:any[]);
	getColumn(x: number): any[];
	setColumn(x: number, column: any[]);
	cellForEach(fn: (value: any, x: number, y: number) => void);
	showView(): string;
}
```
## Other
- [x] 添加各API参数合法性检测
- 处理好 单元测试, 基准测试, 内存测试代码;
	- [x] 单元测试
	- [x] 基准测试
	- [x] 内存占用测试
- [ ] 增加基准测试范围;