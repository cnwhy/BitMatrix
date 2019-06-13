import AnyMatrix from './AnyMatrix';

export default function getTypedMatrixClass<T extends MimeTypeArray>(TypedArrayClass: any) {
	let name = TypedArrayClass.name.replace('Array', 'Matrix');
	return class extends AnyMatrix {
		static className: string = name;
		_data: any | any[];
		constructor(width: number, height: number, defaultValue = 0) {
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
	};
}