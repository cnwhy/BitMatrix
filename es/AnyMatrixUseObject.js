import Matrix from './Matrix';
class AnyMatrixUseObject extends Matrix {
    constructor(width, height, defaultValue) {
        super(width, height);
        let data = (this._data = {});
        if (defaultValue !== undefined) {
            this.fill(defaultValue);
        }
    }
    clone() {
        return Object.create(this, {
            _data: Object.assign(Object.getOwnPropertyDescriptor(this, '_data'), {
                value: Object.assign({}, this._data)
            })
        });
    }
    getPrototypeData() {
        return this._data;
    }
    fill(v) {
        let data = this._data;
        let max = this.total;
        while (max--) {
            data[max] = v;
        }
    }
    fillRow(row, value) {
        this.Validator_row(row);
        let { width, _data } = this;
        let index = width * row;
        while (width--) {
            _data[index++] = value;
        }
    }
    fillColumn(column, v) {
        this.Validator_column(column);
        let { width, _data, total } = this;
        let index = column;
        while (index < total) {
            _data[index] = v;
            index += width;
        }
    }
    get(x, y) {
        this.Validator_xy(x, y);
        return this._data[y * this.width + x];
    }
    set(x, y, v) {
        this.Validator_xy(x, y);
        this._data[y * this.width + x] = v;
    }
    getRow(row) {
        this.Validator_row(row);
        let { width, _data } = this;
        let index = width * row;
        let arr = [];
        while (width--) {
            arr.push(_data[index++]);
        }
        return arr;
    }
    setRow(row, value) {
        this.Validator_row(row);
        let { width, height, _data } = this;
        let index = width * row;
        let _end = width * (row + 1);
        let i = 0;
        while (i < value.length && index < _end) {
            _data[index++] = value[i++];
        }
    }
    getColumn(column) {
        this.Validator_column(column);
        let { width, _data, total } = this;
        let arr = [];
        let index = column;
        while (index < total) {
            arr.push(_data[index]);
            index += width;
        }
        return arr;
    }
    setColumn(column, value) {
        this.Validator_column(column);
        let { width, _data, total } = this;
        let index = column;
        let i = 0;
        while (i < value.length && index < total) {
            _data[index] = value[i++];
            index += width;
        }
    }
    cellForEach(fn) {
        let { _data, width, total } = this;
        let x = 0;
        let y = 0;
        for (let i = 0; i < total; i++) {
            fn(_data[i], x, y);
            if (++x >= width) {
                x = 0;
                y++;
            }
        }
    }
}
export default AnyMatrixUseObject;
