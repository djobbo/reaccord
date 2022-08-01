import { build } from "./build"
import child from "node:child_process"
import type { OutputOptions, RollupOptions } from "rollup"
import type { ReaccordConfig } from "./types"

export const start = async (
	rollupConfig: RollupOptions,
	reaccordConfig: ReaccordConfig,
) => {
	await build(rollupConfig, reaccordConfig)

	const output = rollupConfig.output as OutputOptions
	child.fork(`${process.cwd()}/${output.file}`, [], {
		env: {
			...process.env,
			NODE_ENV: "production",
		},
		stdio: "inherit",
	})
}
