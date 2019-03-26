var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./BitMatrix", "./AnyMatrix", "./AnyMatrixUseObject", "./AnyMatrixUseMap"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const BitMatrix_1 = __importDefault(require("./BitMatrix"));
    exports.BitMatrix = BitMatrix_1.default;
    const AnyMatrix_1 = __importDefault(require("./AnyMatrix"));
    exports.AnyMatrix = AnyMatrix_1.default;
    const AnyMatrixUseObject_1 = __importDefault(require("./AnyMatrixUseObject"));
    exports.AnyMatrixUseObject = AnyMatrixUseObject_1.default;
    const AnyMatrixUseMap_1 = __importDefault(require("./AnyMatrixUseMap"));
    exports.AnyMatrixUseMap = AnyMatrixUseMap_1.default;
    const Int8Matrix = AnyMatrix_1.default.getTypedMatrixClass(Int8Array);
    exports.Int8Matrix = Int8Matrix;
    const Uint8Matrix = AnyMatrix_1.default.getTypedMatrixClass(Uint8Array);
    exports.Uint8Matrix = Uint8Matrix;
    const Uint8ClampedMatrix = AnyMatrix_1.default.getTypedMatrixClass(Uint8ClampedArray);
    exports.Uint8ClampedMatrix = Uint8ClampedMatrix;
    const Int16Matrix = AnyMatrix_1.default.getTypedMatrixClass(Int16Array);
    exports.Int16Matrix = Int16Matrix;
    const Uint16Matrix = AnyMatrix_1.default.getTypedMatrixClass(Uint16Array);
    exports.Uint16Matrix = Uint16Matrix;
    const Int32Matrix = AnyMatrix_1.default.getTypedMatrixClass(Int32Array);
    exports.Int32Matrix = Int32Matrix;
    const Uint32Matrix = AnyMatrix_1.default.getTypedMatrixClass(Uint32Array);
    exports.Uint32Matrix = Uint32Matrix;
    const Float32Matrix = AnyMatrix_1.default.getTypedMatrixClass(Float32Array);
    exports.Float32Matrix = Float32Matrix;
    const Float64Matrix = AnyMatrix_1.default.getTypedMatrixClass(Float64Array);
    exports.Float64Matrix = Float64Matrix;
});
