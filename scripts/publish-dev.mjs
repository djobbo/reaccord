#!/usr/bin/env zx

const PLACEHOLDER_VERSION = "0.0.0-dev"

const mainPackage = "reaccord"
const packages = [
	["reaccord", "reaccord"],
	["cli", "@reaccord/cli"],
	["router", "@reaccord/router"],
	["canvas", "@reaccord/canvas"],
]

const rawDevVersion = `${await $`npm show . version`}`.slice(0, -1)
const gitShortHash = `${await $`git rev-parse --short HEAD`}`.slice(0, -1)

console.log(`Checking latest dev version of '${mainPackage}'...`)
const latestPackageVersion =
	`${await $`pnpm view ${mainPackage}@dev version`}`.slice(0, -1)

const latestCommitPublished = latestPackageVersion.split(".").at(-1)
if (latestCommitPublished === gitShortHash) {
	console.log(`No new version found.`)
	process.exit(0)
}

const timestamp = Date.now()
const newDevVersion = `${rawDevVersion}.${timestamp}.${gitShortHash}`

console.log(`Publishing new dev version '${newDevVersion}'...`)

await $`pnpm ci`

for (const [packageFolder, packageName] of packages) {
	console.log(`Updating ${packageName} version to ${newDevVersion}`)

	// Deprecate the old version
	const oldDevVersion =
		`${await $`pnpm view ${packageName}@dev version`}`.slice(0, -1)

	if (!!oldDevVersion) {
		try {
			await $`pnpm deprecate ${packageName}@${oldDevVersion} "no longer supported"`
			console.log(`Deprecated '${packageName}@${oldDevVersion}'`)
		} catch {
			console.error(
				`Failed to deprecate '${packageName}@${oldDevVersion}'`,
			)
		}
	}

	const packagePath = `packages/${packageFolder}`

	await cd(packagePath)

	// Build package
	await $`pnpm build || true`

	// Update package version
	await $`sed -i "s/workspace:${PLACEHOLDER_VERSION}/${newDevVersion}/g" package.json`
	await $`sed -i "s/${PLACEHOLDER_VERSION}/${newDevVersion}/g" package.json`

	// Publish package
	console.log(`Publishing '${packageName}'...`)
	try {
		await $`pnpm publish --no-git-checks --tag dev --access public`
		console.log(`Published '${packageName}'@${newDevVersion}`)
	} catch {
		console.error(`Failed to publish '${packageName}'@${newDevVersion}`)
	}

	await cd("../..")
}
