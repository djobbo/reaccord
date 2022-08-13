#!/usr/bin/env zx
import stripAnsi from "strip-ansi"

$.verbose = false

const [, , ...args] = process.argv

const dryRun = args.includes("--dry")

const PLACEHOLDER_VERSION = "0.0.0-dev"

const mainPackage = "reaccord"
const packages = [
  ["reaccord", "reaccord"],
  ["router", "@reaccord/router"],
  ["canvas", "@reaccord/canvas"],
]

const logInfo = (...args) => console.log(chalk.gray("[Info]"), ...args)
const logSuccess = (...args) => console.log(chalk.green("[Success]"), ...args)
const logError = (...args) => console.log(chalk.red("[Error]"), ...args)
const logWarning = (...args) => console.log(chalk.yellow("[Warning]"), ...args)
const logBoxed = (msg) => {
  const len = stripAnsi(msg).length + 2
  console.log("╭" + "─".repeat(len) + "╮")
  console.log("│ " + msg + " │")
  console.log("╰" + "─".repeat(len) + "╯")
}
const newLine = () => console.log()

const { version } = await fs.readJson("./package.json")
logBoxed(`Publishing Reaccord ${chalk.green(`v${version}-dev`)}`)
const gitShortHash = `${await $`git rev-parse --short HEAD`}`.slice(0, -1)

logInfo(`Checking latest dev version of ${chalk.blue(mainPackage)}...`)
const latestPackageVersion =
  `${await $`pnpm view ${mainPackage}@dev version`}`.slice(0, -1)
logInfo(
  `Latest dev version of ${chalk.blue(mainPackage)} is ${chalk.green(
    latestPackageVersion,
  )}`,
)

const latestCommitPublished = latestPackageVersion.split(".").at(-1)
if (latestCommitPublished === gitShortHash) {
  logWarning(`No new version found, skipping publish.`)
  process.exit(0)
}
logInfo(`A more recent commit was found, publishing new version.`)

const timestamp = Date.now()
const newDevVersion = `${version}-dev.${timestamp}.${gitShortHash}`

newLine()
logBoxed(`New dev version: ${chalk.green(`v${newDevVersion}`)}`)

logInfo("Installing dependencies...")
await $`pnpm ci`
logSuccess("Dependencies installed.")
newLine()

for (const [packageFolder, packageName] of packages) {
  logBoxed(`Publishing ${chalk.blue(packageName)}`)

  // Deprecate the old version
  logInfo("Checking for existing dev version...")
  const oldDevVersion =
    `${await $`pnpm view ${packageName}@dev version || false`
      // Will throw if package doesn't exist on the registry
      .catch(() => "")}`.slice(0, -1)

  if (!!oldDevVersion) {
    logInfo(
      `Existing dev version found, deprecating old dev version ${chalk.yellow(
        oldDevVersion,
      )}...`,
    )
    try {
      if (!dryRun)
        await $`pnpm deprecate ${packageName}@${oldDevVersion} "no longer supported"`

      logSuccess(
        `Deprecated ${chalk.yellow(`${packageName}@${oldDevVersion}`)}`,
      )
    } catch {
      logError(
        `Failed to deprecate ${chalk.yellow(
          `${packageName}@${oldDevVersion}`,
        )}`,
      )
    }
  } else {
    logInfo(`No existing dev version found, skipping deprecation.`)
  }
  newLine()

  const packagePath = `packages/${packageFolder}`

  await cd(packagePath)

  // Build package
  logInfo(`Building ${chalk.blue(packageName)}...`)
  await $`pnpm build`
  logSuccess(`Built ${chalk.blue(packageName)}`)
  newLine()

  // Update package version
  logInfo(
    `Updating ${chalk.blue(packageName)} version to ${chalk.green(
      `v${newDevVersion}`,
    )}`,
  )
  if (!dryRun) {
    await $`sed -i "s/workspace:${PLACEHOLDER_VERSION}/${newDevVersion}/g" package.json`
    await $`sed -i "s/${PLACEHOLDER_VERSION}/${newDevVersion}/g" package.json`
  }
  logSuccess(
    `Updated ${chalk.blue(packageName)} version to ${chalk.green(
      `v${newDevVersion}`,
    )}`,
  )

  // Publish package
  logInfo(`Publishing ${chalk.blue(packageName)} to NPM...`)
  try {
    if (!dryRun) await $`pnpm publish --no-git-checks --tag dev --access public`

    logSuccess(`Published ${chalk.green(`${packageName}@${newDevVersion}`)}`)
    logInfo(
      `View package at ${chalk.gray(
        `https://npmjs.com/package/${packageName}`,
      )}`,
    )
  } catch {
    logError(
      `Failed to publish ${chalk.yellow(`${packageName}@${newDevVersion}`)}`,
    )
  }
  newLine()

  await cd("../..")
}

logInfo(`${packages.length}/${packages.length} packages published.`)
logBoxed(`Successfully published Reaccord ${chalk.green(`v${newDevVersion}`)}`)
