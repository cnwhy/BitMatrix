import BitMatrix from './BitMatrix';
import AnyMatrix from './AnyMatrix';
import AnyMatrixUseObject from './AnyMatrixUseObject';
import Matrix from './AnyMatrix';
import CreateMatrixClass from './CreateMatrixClass';
// Map 太占资源, 内存测试都爆内存, 移出算了
// import AnyMatrixUseMap from './AnyMatrixUseMap';
// const CreateMatrixClass = Matrix.CreateMatrixClass.bind(null,AnyMatrix);

const Int8Matrix = CreateMatrixClass(Int8Array);
const Uint8Matrix = CreateMatrixClass(Uint8Array);
const Uint8ClampedMatrix = CreateMatrixClass(Uint8ClampedArray);
const Int16Matrix = CreateMatrixClass(Int16Array);
const Uint16Matrix = CreateMatrixClass(Uint16Array);
const Int32Matrix = CreateMatrixClass(Int32Array);
const Uint32Matrix = CreateMatrixClass(Uint32Array);
const Float32Matrix = CreateMatrixClass(Float32Array);
const Float64Matrix = CreateMatrixClass(Float64Array);
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
