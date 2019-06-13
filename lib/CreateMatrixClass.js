"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnyMatrix_1 = __importDefault(require("./AnyMatrix"));
function getTypedMatrixClass(TypedArrayClass) {
    var _a;
    let name = TypedArrayClass.name.replace('Array', 'Matrix');
    return _a = class extends AnyMatrix_1.default {
            constructor(width, height, defaultValue = 0) {
                super(width, height, defaultValue);
            }
            _dataInit() {
                this._data = new TypedArrayClass(this.total);
            }
            clone() {
                return Object.create(this, {
                    _data: Object.assign(Object.getOwnPropertyDescriptor(this, '_data'), {
                        value: new TypedArrayClass(this._data.buffer.slice(0))
                    })
                });
            }
        },
        _a.className = name,
        _a;
}
exports.default = getTypedMatrixClass;
