import { babel } from '@rollup/plugin-babel';
import run from '@rollup/plugin-run';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

const dev = process.env.NODE_ENV !== 'production';
const extensions = ['.ts', '.tsx'];

const config = {
	input: 'src/index.tsx',
	external: ['discord.js', 'dotenv', 'axios'],
	output: {
		dir: 'out',
		format: 'cjs',
	},
	watch: {
		clearScreen: true,
		exclude: ['node_modules'],
	},
	plugins: [
		nodeResolve({ extensions }),
		babel({
			extensions,
			babelHelpers: 'bundled',
			presets: [
				'@babel/preset-typescript',
				[
					'babel-preset-solid',
					{
						moduleName: '@reaccord/solid',
						generate: 'universal',
					},
				],
			],
			include: /src\//,
			exclude: /node_modules\//,
		}),
		commonjs({
			extensions,
		}),
		dev && run(),
	],
};

export default config;
