import BitMatrix from './BitMatrix';
import AnyMatrix from './AnyMatrix';
import AnyMatrixUseObject from './AnyMatrixUseObject';
import AnyMatrixUseMap from './AnyMatrixUseMap';

const Int8Matrix = AnyMatrix.getTypedMatrixClass(Int8Array);
const Uint8Matrix = AnyMatrix.getTypedMatrixClass(Uint8Array);
const Uint8ClampedMatrix = AnyMatrix.getTypedMatrixClass(Uint8ClampedArray);
const Int16Matrix = AnyMatrix.getTypedMatrixClass(Int16Array);
const Uint16Matrix = AnyMatrix.getTypedMatrixClass(Uint16Array);
const Int32Matrix = AnyMatrix.getTypedMatrixClass(Int32Array);
const Uint32Matrix = AnyMatrix.getTypedMatrixClass(Uint32Array);
const Float32Matrix = AnyMatrix.getTypedMatrixClass(Float32Array);
const Float64Matrix = AnyMatrix.getTypedMatrixClass(Float64Array);

export {
	BitMatrix,
	AnyMatrix,
	AnyMatrixUseObject,
	AnyMatrixUseMap,
	Int8Matrix,
	Uint8Matrix,
	Uint8ClampedMatrix,
	Int16Matrix,
	Uint16Matrix,
	Int32Matrix,
	Uint32Matrix,
	Float32Matrix,
	Float64Matrix
};
