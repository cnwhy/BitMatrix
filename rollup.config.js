import typescript from 'rollup-plugin-typescript';
import nodeResolve from 'rollup-plugin-node-resolve';
// import commonjs from 'rollup-plugin-commonjs';
// import es3 from 'rollup-plugin-es3'
import pkg from './package.json';

let banner = `/*!
 * ${pkg.name}  v${pkg.version}
 * Homepage ${pkg.homepage}
 * License ${pkg.license}
 */
`;
let external = Object.keys(pkg.dependencies);
let plugins_typeES2015 = typescript({
	target: 'ES2015',
	module: 'ES2015',
	removeComments: true
});

let out_BitMatrix = [
	{
		input: './src/index.ts',
		plugins: [plugins_typeES2015],
		output: [
			{
				file: pkg.module,
				format: 'es',
				banner: banner
			},
			{
				file: pkg.main,
				format: 'cjs',
				exports: 'named'
			}
		],
		external
	},
	{
		input: pkg.module,
		plugins: [nodeResolve()],
		output: [
			{
				file: pkg.browser,
				format: 'umd',
				name: 'BitMatrix',
				exports: 'named'
			}
		]
	}
];

// let out_AllMatrix = [
// 	{
// 		input: './src/index.ts',
// 		plugins: [plugins_typeES2015],
// 		output: [
// 			{
// 				file: './lib/index.es.js',
// 				format: 'es',
// 				banner: banner
// 			}
// 		],
// 		external
// 	},
// 	{
// 		input: './lib/index.es.js',
// 		plugins: [nodeResolve()],
// 		output: [
// 			{
// 				file: './lib/index.js',
// 				name: 'AllMatrix',
// 				format: 'umd'
// 			}
// 		]
// 	}
// ];

export default [...out_BitMatrix];
