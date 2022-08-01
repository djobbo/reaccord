import child from "node:child_process"

export const dev = (filename: string) => {
	const tsnd = require.resolve("ts-node-dev/package.json")
	const tsndPkg = require("ts-node-dev/package.json")

	child.fork(`${tsnd}/../${tsndPkg.bin.tsnd}`, ["--respawn", filename], {
		env: {
			...process.env,
			NODE_ENV: "development",
		},
		stdio: "inherit",
	})
}
