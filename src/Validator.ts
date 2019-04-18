// function isInteger(value: any): boolean {
// 	if (typeof Number['isInteger'] == 'function') {
// 		return Number['isInteger'](value);
// 	} else {
// 		return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
// 	}
// }
const isInteger = Number.isInteger;

export {
	isInteger
}