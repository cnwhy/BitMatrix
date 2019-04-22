import Matrix from './Matrix';
function Bit2Array(byte, start = 0, end) {
    let arr = [];
    let v = byte >> start;
    end = end && end < 8 ? end : 8;
    for (let i = start; i < end; i++) {
        arr.push(v & 1 ? 1 : 0);
        v >>= 1;
    }
    return arr;
}
function ArraySetBit(byte, arr, start = 0, end) {
    end = end && end < 8 ? end : 8;
    let index = start, i = 0;
    while (index < end && i < arr.length) {
        if (arr[i]) {
            byte |= 1 << index;
        }
        else {
            byte &= ~(1 << index);
        }
        i++, index++;
    }
    return byte;
}
class BitMatrix extends Matrix {
    constructor(width, height, defaultValue = 0) {
        super(width, height);
        this._data = new Uint8Array(Math.ceil((width * height) / 8));
        if (defaultValue) {
            this._data.fill(255);
        }
    }
    clone() {
        return Object.create(this, {
            _data: Object.assign(Object.getOwnPropertyDescriptor(this, '_data'), {
                value: new Uint8Array(this._data.buffer.slice(0))
            })
        });
    }
    getPrototypeData() {
        return this._data;
    }
    fill(value) {
        this._data.fill(!!value ? 255 : 0);
    }
    fillRow(row, value) {
        this.Validator_row(row);
        let { width, height, _data, total } = this;
        let start = this.getIndex(0, row);
        let end = this.getIndex(width - 1, row);
        if (start.index === end.index) {
            if (value) {
                _data[start.index] |= (Math.pow(2, width) - 1) << start.offset;
            }
            else {
                _data[start.index] &= 0xff >> (8 - start.offset) | 0xFF << (end.offset + 1);
            }
            return;
        }
        if (value) {
            _data[start.index] |= 0xff << start.offset;
            _data[end.index] |= 0xff >> (7 - end.offset);
        }
        else {
            _data[start.index] &= 0xff >> (8 - start.offset);
            _data[end.index] &= 0xff << (end.offset + 1);
        }
        for (let index = start.index + 1; index < end.index; index++) {
            _data[index] = value ? 0xff : 0;
        }
    }
    fillColumn(column, v) {
        this.Validator_column(column);
        let { width, height, _data, total } = this;
        let set = (function () {
            if (v) {
                return function (i, offset) {
                    _data[i] |= 1 << offset;
                };
            }
            else {
                return function (i, offset) {
                    _data[i] &= ~(1 << offset);
                };
            }
        })();
        for (let h = 0; h < height; h++) {
            let { index, offset } = this.getIndex(column, h);
            set(index, offset);
        }
    }
    get(x, y) {
        let { index, offset } = this.getIndex(x, y);
        return (this._data[index] >> offset) & 1;
    }
    set(x, y, v) {
        let { index, offset } = this.getIndex(x, y);
        if (v) {
            this._data[index] |= 1 << offset;
        }
        else {
            this._data[index] &= ~(1 << offset);
        }
    }
    getRow(row) {
        let { width, height, _data } = this;
        let start = this.getIndex(0, row);
        let end = this.getIndex(width - 1, row);
        if (start.index === end.index) {
            return Bit2Array(_data[start.index], start.offset, end.offset + 1);
        }
        let arr = Bit2Array(_data[start.index], start.offset);
        for (let index = start.index + 1; index < end.index; index++) {
            arr = arr.concat(Bit2Array(_data[index]));
        }
        arr = arr.concat(Bit2Array(_data[end.index], 0, end.offset + 1));
        return arr;
    }
    setRow(row, value) {
        let { width, height, _data, total } = this;
        let start = this.getIndex(0, row);
        let end = this.getIndex(width - 1, row);
        let i = 0;
        if (start.index === end.index) {
            _data[start.index] = ArraySetBit(_data[start.index], value, start.offset, start.offset + width);
            return;
        }
        _data[start.index] = ArraySetBit(_data[start.index], value, start.offset);
        i = 8 - start.offset;
        for (let index = start.index + 1; index < end.index && i < value.length; index++) {
            let byte = _data[index];
            _data[index] = ArraySetBit(byte, value.slice(i));
            i += 8;
        }
        if (i >= value.length)
            return;
        _data[end.index] = ArraySetBit(_data[end.index], value.slice(i), 0, end.offset + 1);
    }
    getColumn(column) {
        this.Validator_column(column);
        let { height } = this;
        let arr = [];
        let h = 0;
        while (h < height) {
            arr.push(this.get(column, h++));
        }
        return arr;
    }
    setColumn(column, value) {
        this.Validator_column(column);
        let { height } = this;
        let i = 0;
        while (i < value.length && i < height) {
            this.set(column, i, value[i++]);
        }
    }
    cellForEach(fn) {
        let { width, height, total: length, _data: byteArray } = this;
        let x = 0, y = 0;
        let blength = byteArray.length;
        for (let i = 0; i < blength; i++) {
            let v = byteArray[i];
            for (let b = 0; b < 8; b++) {
                fn((v >> b) & 1, x, y);
                if (++x >= width) {
                    x = 0;
                    y++;
                    if (y >= height)
                        return;
                }
            }
        }
    }
    getIndex(x, y) {
        this.Validator_xy(x, y);
        let n = y * this.width + x + 1;
        return {
            index: Math.ceil(n / 8) - 1,
            offset: (n - 1) % 8
        };
    }
}
export default BitMatrix;
