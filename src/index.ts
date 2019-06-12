import BitMatrix from './BitMatrix';
import AnyMatrix from './AnyMatrix';
import AnyMatrixUseObject from './AnyMatrixUseObject';
import Matrix from './AnyMatrix';

// Map 太占资源, 内存测试都爆内存, 移出算了
// import AnyMatrixUseMap from './AnyMatrixUseMap';
const getTypedMatrixClass = Matrix.getTypedMatrixClass.bind(null,AnyMatrix);

const Int8Matrix = getTypedMatrixClass(Int8Array);
const Uint8Matrix = getTypedMatrixClass(Uint8Array);
const Uint8ClampedMatrix = getTypedMatrixClass(Uint8ClampedArray);
const Int16Matrix = getTypedMatrixClass(Int16Array);
const Uint16Matrix = getTypedMatrixClass(Uint16Array);
const Int32Matrix = getTypedMatrixClass(Int32Array);
const Uint32Matrix = getTypedMatrixClass(Uint32Array);
const Float32Matrix = getTypedMatrixClass(Float32Array);
const Float64Matrix = getTypedMatrixClass(Float64Array);
export default BitMatrix;
export {
	AnyMatrix,
	AnyMatrixUseObject,
	BitMatrix,
	Int8Matrix,
	Uint8Matrix,
	Uint8ClampedMatrix,
	Int16Matrix,
	Uint16Matrix,
	Int32Matrix,
	Uint32Matrix,
	Float32Matrix,
	Float64Matrix,
	Uint8Matrix as ByteMatrix,
};
