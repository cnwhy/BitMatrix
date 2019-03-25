const BitMatrix = require('../lib/BitMatrix').default;
const Uint8Matrix = require('../lib/Uint8Matrix').default;
const Int8Matrix = require('../lib/Int8Matrix').default;
const Uint16Matrix = require('../lib/Uint16Matrix').default;
const Int16Matrix = require('../lib/Int16Matrix').default;
const Uint32Matrix = require('../lib/Uint32Matrix').default;
const Int32Matrix = require('../lib/Int32Matrix').default;
const AnyMatrix = require('../lib/AnyMatrix').default;
const AnyMatrixUseObject = require('../lib/AnyMatrixUseObject').default;
const AnyMatrixUseMap = require('../lib/AnyMatrixUseMap').default;

exports.allClass = [
	BitMatrix,
	Uint8Matrix,
	Int8Matrix,
	Uint16Matrix,
	Int16Matrix,
	Uint32Matrix,
	Int32Matrix,
	AnyMatrix,
	AnyMatrixUseObject,
	AnyMatrixUseMap
];

exports.typicalClass = [
	BitMatrix,
	Uint8Matrix,
	AnyMatrix,
	AnyMatrixUseObject,
	AnyMatrixUseMap
]