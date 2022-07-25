const pkgs = ["reaccord", "@reaccord/jsx", "@reaccord/router", "@reaccord/cli"]

const versionsStr = await $`pnpm view ${pkg}@dev versions --json`
const versions = JSON.parse(`${versionsStr}`).slice(0, -1)

for (const pkg of pkgs) {
    for (const version of versions) {
        console.log(`\n--- Deprecating ${version} ---`)
        try {
            try {
                await $`pnpm view ${pkg}@${version} | grep "DEPRECATED"`
                console.log("Package is already deprecated")
            } catch {
                await $`pnpm deprecate ${pkg}@${version} "no longer supported"`
                console.log(`Successfully deprecated ${version}`)
            }
        } catch (e) {
            console.error(`Failed to deprecate ${version}`)
        }
    }
}
