var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
        Matrix.prototype.showView = function () {
            var height = this.height;
            var y = 0;
            var view = [];
            while (y < height) {
                view.push(this.getRow(y++).join(','));
            }
            return view.join('\n');
            // let { width, height } = this;
            // let _w = width - 1;
            // let _h = height - 1;
            // let str = '';
            // this.cellForEach(function(v, x, y) {
            // 	str += v;
            // 	str += x < _w ? ',' : y < _h ? '\n' : '';
            // });
            // return str;
        };
        Matrix.from = function (arrayLike, width) {
            //arrayLike[, mapFn[, thisArg]
            var _width, _height;
            if (width != undefined) {
                if (!Validator_1.isInteger(width))
                    throw TypeError('width must be an integer');
                if (width < 1)
                    throw RangeError('x out of range');
                _width = width;
                _height = Math.ceil(arrayLike.length / _width);
                var m = new this(_width, _height);
                // m._data = arrayLike.slice(0);
                for (var i = 0; i < _height; i++) {
                    m.setRow(i, arrayLike.slice(i * _width, (i + 1) * _width));
                }
                return m;
            }
            else {
                _width = arrayLike[0].length;
                _height = arrayLike.length;
                var m = new this(_width, _height);
                for (var i = 0; i < arrayLike.length; i++) {
                    m.setRow(i, arrayLike[i]);
                }
                return m;
            }
        };
        return Matrix;
    }());
    (function (Matrix) {
        function getTypedMatrixClass(AnyMatrix, TypedArrayClass) {
            var _a;
            var name = TypedArrayClass.name.replace('Array', 'Matrix');
            return _a = /** @class */ (function (_super) {
                    __extends(class_1, _super);
                    function class_1() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    // constructor(width: number, height: number, defaultValue = 0) {
                    // 	super(width, height, defaultValue);
                    // }
                    class_1.prototype._dataInit = function () {
                        this._data = new TypedArrayClass(this.total);
                    };
                    class_1.prototype.clone = function () {
                        return Object.create(this, {
                            _data: Object.assign(Object.getOwnPropertyDescriptor(this, '_data'), {
                                value: new TypedArrayClass(this._data.buffer.slice(0))
                            })
                        });
                    };
                    return class_1;
                }(AnyMatrix)),
                _a.className = name,
                _a;
        }
        Matrix.getTypedMatrixClass = getTypedMatrixClass;
        // export function from<T extends Matrix>(this:{new(a,b):T}, arrayLike:any[],width?:number):T{//arrayLike[, mapFn[, thisArg]
        // 	let _width:number,_height:number;
        // 	if(width != undefined){
        // 		if(!isInteger(width)) throw TypeError('width must be an integer');
        // 		if(width<1) throw RangeError('x out of range');
        // 		_width = width;
        // 		_height = Math.ceil(arrayLike.length/_width);
        // 		let m = new this(_width,_height);
        // 		// m._data = arrayLike.slice(0);
        // 		for(let i = 0; i<_height; i++){
        // 			m.setRow(i,arrayLike.slice(i*_width,(i+1)*_width));
        // 		}
        // 		return m;
        // 	}else{
        // 		_width = arrayLike[0].length;
        // 		_height = arrayLike.length;
        // 		let m = new this(_width,_height);
        // 		for(let i =0; i<arrayLike.length;i++){
        // 			m.setRow(i,arrayLike[i]);
        // 		}
        // 		return m;
        // 	}
        // }
    })(Matrix || (Matrix = {}));
    return Matrix;
});
