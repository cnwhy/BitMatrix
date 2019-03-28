(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    function isInteger(value) {
        if (typeof Number['isInteger'] == 'function') {
            return Number['isInteger'](value);
        }
        else {
            return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
        }
    }
    var Matrix = /** @class */ (function () {
        function Matrix(width, height) {
            if (width < 0 || height < 0)
                throw RangeError('width and height must be greater than 0');
            // if (!Number.isInteger(width) || !Number.isInteger(height))
            if (!isInteger(width) || !isInteger(height))
                throw RangeError('width and height must be an integer');
            Object.defineProperty(this, 'width', { value: width });
            Object.defineProperty(this, 'height', { value: height });
            Object.defineProperty(this, 'total', { value: width * height });
        }
        return Matrix;
    }());
    return Matrix;
});
