var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./BitMatrix", "./AnyMatrix", "./AnyMatrixUseObject", "./Matrix"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BitMatrix_1 = __importDefault(require("./BitMatrix"));
    exports.BitMatrix = BitMatrix_1.default;
    exports.ByteMatrix = BitMatrix_1.default;
    var AnyMatrix_1 = __importDefault(require("./AnyMatrix"));
    exports.AnyMatrix = AnyMatrix_1.default;
    var AnyMatrixUseObject_1 = __importDefault(require("./AnyMatrixUseObject"));
    exports.AnyMatrixUseObject = AnyMatrixUseObject_1.default;
    var Matrix = require("./Matrix");
    // import AnyMatrixUseMap from './AnyMatrixUseMap';
    var getTypedMatrixClass = Matrix.getTypedMatrixClass.bind(null, AnyMatrix_1.default);
    var Int8Matrix = getTypedMatrixClass(Int8Array);
    exports.Int8Matrix = Int8Matrix;
    var Uint8Matrix = getTypedMatrixClass(Uint8Array);
    exports.Uint8Matrix = Uint8Matrix;
    var Uint8ClampedMatrix = getTypedMatrixClass(Uint8ClampedArray);
    exports.Uint8ClampedMatrix = Uint8ClampedMatrix;
    var Int16Matrix = getTypedMatrixClass(Int16Array);
    exports.Int16Matrix = Int16Matrix;
    var Uint16Matrix = getTypedMatrixClass(Uint16Array);
    exports.Uint16Matrix = Uint16Matrix;
    var Int32Matrix = getTypedMatrixClass(Int32Array);
    exports.Int32Matrix = Int32Matrix;
    var Uint32Matrix = getTypedMatrixClass(Uint32Array);
    exports.Uint32Matrix = Uint32Matrix;
    var Float32Matrix = getTypedMatrixClass(Float32Array);
    exports.Float32Matrix = Float32Matrix;
    var Float64Matrix = getTypedMatrixClass(Float64Array);
    exports.Float64Matrix = Float64Matrix;
});
