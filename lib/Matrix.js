(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./Validator"], factory);
    }
})(function (require, exports) {
    "use strict";
    var Validator_1 = require("./Validator");
    var Matrix = /** @class */ (function () {
        function Matrix(width, height) {
            if (!Validator_1.isInteger(width) || !Validator_1.isInteger(height))
                throw RangeError('width and height must be an integer');
            if (width < 0 || height < 0)
                throw RangeError('width and height must be greater than 0');
            // if (!Number.isInteger(width) || !Number.isInteger(height))
            Object.defineProperty(this, 'width', { value: width });
            Object.defineProperty(this, 'height', { value: height });
            Object.defineProperty(this, 'total', { value: width * height });
        }
        return Matrix;
    }());
    return Matrix;
});
