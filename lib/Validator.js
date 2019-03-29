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
    var Validator;
    (function (Validator) {
        function isInteger(value) {
            // if (typeof Number['isInteger'] == 'function') {
            // 	return Number['isInteger'](value);
            // } else {
            return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
            // }
        }
        Validator.isInteger = isInteger;
    })(Validator || (Validator = {}));
    return Validator;
});
