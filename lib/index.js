"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BitMatrix_1 = __importDefault(require("./BitMatrix"));
exports.BitMatrix = BitMatrix_1.default;
const AnyMatrix_1 = __importDefault(require("./AnyMatrix"));
exports.AnyMatrix = AnyMatrix_1.default;
const AnyMatrixUseObject_1 = __importDefault(require("./AnyMatrixUseObject"));
exports.AnyMatrixUseObject = AnyMatrixUseObject_1.default;
const CreateMatrixClass_1 = __importDefault(require("./CreateMatrixClass"));
const Int8Matrix = CreateMatrixClass_1.default(Int8Array);
exports.Int8Matrix = Int8Matrix;
const Uint8Matrix = CreateMatrixClass_1.default(Uint8Array);
exports.Uint8Matrix = Uint8Matrix;
exports.ByteMatrix = Uint8Matrix;
const Uint8ClampedMatrix = CreateMatrixClass_1.default(Uint8ClampedArray);
exports.Uint8ClampedMatrix = Uint8ClampedMatrix;
const Int16Matrix = CreateMatrixClass_1.default(Int16Array);
exports.Int16Matrix = Int16Matrix;
const Uint16Matrix = CreateMatrixClass_1.default(Uint16Array);
exports.Uint16Matrix = Uint16Matrix;
const Int32Matrix = CreateMatrixClass_1.default(Int32Array);
exports.Int32Matrix = Int32Matrix;
const Uint32Matrix = CreateMatrixClass_1.default(Uint32Array);
exports.Uint32Matrix = Uint32Matrix;
const Float32Matrix = CreateMatrixClass_1.default(Float32Array);
exports.Float32Matrix = Float32Matrix;
const Float64Matrix = CreateMatrixClass_1.default(Float64Array);
exports.Float64Matrix = Float64Matrix;
exports.default = BitMatrix_1.default;
