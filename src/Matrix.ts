import { isInteger } from './Validator';

class Matrix {
	width: number;
	height: number;
	total: number;
	constructor(width: number, height: number) {
		if (!isInteger(width) || !isInteger(height)) throw RangeError('width and height must be an integer');
		if (width < 0 || height < 0) throw RangeError('width and height must be greater than 0');
		// if (!Number.isInteger(width) || !Number.isInteger(height))
		Object.defineProperty(this, 'width', { value: width });
		Object.defineProperty(this, 'height', { value: height });
		Object.defineProperty(this, 'total', { value: width * height });
	}
}

export = Matrix;
