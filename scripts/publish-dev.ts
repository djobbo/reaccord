#!/usr/bin/env bun

import { $ } from "bun"
import { version } from "../package.json"
import chalk from "chalk"
import stripAnsi from "strip-ansi"

const PLACEHOLDER_VERSION = "0.0.0-dev"

const logInfo = (...args: string[]) =>
  console.log(chalk.gray("[Info]"), ...args)
const logSuccess = (...args: string[]) =>
  console.log(chalk.green("[Success]"), ...args)
const logError = (...args: string[]) =>
  console.log(chalk.red("[Error]"), ...args)
const logWarning = (...args: string[]) =>
  console.log(chalk.yellow("[Warning]"), ...args)
const logBoxed = (msg: string) => {
  const len = stripAnsi(msg).length + 2
  console.log("╭" + "─".repeat(len) + "╮")
  console.log("│ " + msg + " │")
  console.log("╰" + "─".repeat(len) + "╯")
}
const newLine = () => console.log()

const updateLocalDeps = (deps: Record<string, string>, newVersion: string) =>
  Object.fromEntries(
    Object.entries(deps || {}).map(([dep, ver]) => [
      dep,
      [
        PLACEHOLDER_VERSION,
        `workspace:${PLACEHOLDER_VERSION}`,
        `workspace:*`,
      ].includes(typeof ver === "string" ? ver : "")
        ? newVersion
        : ver,
    ]),
  )

const [, , packageName, packageFolder, ...args] = process.argv

if (!packageName) {
  logError("Missing package name")
  process.exit(1)
}

if (!packageFolder) {
  logError("Missing package folder")
  process.exit(1)
}

const dryRun = args.includes("--dry-run")

logBoxed(`Publishing ${packageName} ${chalk.green(`v${version}-dev`)}`)
let gitShortHash: string | null = null
try {
  gitShortHash = await $`git rev-parse --short HEAD`.text()
} catch {}

console.log(gitShortHash)

if (!gitShortHash) {
  logError("Failed to get git short hash")
  process.exit(1)
}

logInfo(`Checking latest dev version of ${chalk.blue(packageName)}...`)
let previousDevVersion: string | null = null

try {
  previousDevVersion = await $`npm view ${packageName}@dev version`.text()
} catch {}

if (previousDevVersion) {
  logInfo(
    `Latest dev version of ${chalk.blue(packageName)} is ${chalk.green(
      previousDevVersion,
    )}`,
  )

  const latestDevVersionHash = previousDevVersion.split(".").at(-1)
  if (latestDevVersionHash === gitShortHash) {
    logWarning(`No new version found, skipping publish.`)
    process.exit(0)
  }
}

const timestamp = Date.now()
const newDevVersion = `${version}-dev.${timestamp}.${gitShortHash}`

newLine()
logBoxed(
  `Publishing New ${packageName}@dev version: ${chalk.green(`v${newDevVersion}`)}`,
)

logInfo("Installing dependencies...")
await $`bun i --frozen-lockfile`
logSuccess("Dependencies installed.")
newLine()

logBoxed(`Publishing ${chalk.blue(packageName)}`)

// Deprecate the old version
if (previousDevVersion) {
  logInfo(
    `Existing dev version found, deprecating old dev version ${chalk.yellow(
      previousDevVersion,
    )}...`,
  )
  try {
    if (!dryRun)
      await $`npm deprecate ${packageName}@${previousDevVersion} "no longer supported"`

    logSuccess(
      `Successfully deprecated ${chalk.yellow(`${packageName}@${previousDevVersion}`)}`,
    )
  } catch {
    logError(
      `Failed to deprecate ${chalk.yellow(`${packageName}@${previousDevVersion}`)}`,
    )
  }
}
newLine()

// Build package
logInfo(`Building ${chalk.blue(packageName)}...`)
await $`bun run build --scope=${packageName} --no-deps --include-dependencies`
logSuccess(`Built ${chalk.blue(packageName)}`)
newLine()

// Update package version
logInfo(
  `Updating ${chalk.blue(packageName)} version to ${chalk.green(
    `v${newDevVersion}`,
  )}`,
)

const packageJsonPath = packageFolder + "/package.json"

if (!dryRun) {
  const packageJson = await import(packageJsonPath)
  packageJson.version = newDevVersion

  packageJson.dependencies = updateLocalDeps(
    packageJson.dependencies,
    newDevVersion,
  )
  packageJson.devDependencies = updateLocalDeps(
    packageJson.devDependencies,
    newDevVersion,
  )

  await Bun.write(packageJsonPath, JSON.stringify(packageJson, null, 2))
} else {
  logInfo(`Dry run: Would have updated version to ${newDevVersion}`)
}

logSuccess(
  `Updated ${chalk.blue(packageName)} version to ${chalk.green(
    `v${newDevVersion}`,
  )}`,
)

// Publish package
logInfo(`Publishing ${chalk.blue(packageName)} to NPM...`)
try {
  if (!dryRun) {
    await $`npm publish --no-git-checks --tag dev --access public`
  } else {
    logInfo(`Dry run: Would have published ${packageName}@${newDevVersion}`)
  }

  logSuccess(`Published ${chalk.green(`${packageName}@${newDevVersion}`)}`)
  logInfo(
    `View package at ${chalk.gray(`https://npmjs.com/package/${packageName}`)}`,
  )
} catch {
  logError(
    `Failed to publish ${chalk.yellow(`${packageName}@${newDevVersion}`)}`,
  )
  process.exit(1)
}
newLine()

logBoxed(`Successfully published Reaccord ${chalk.green(`v${newDevVersion}`)}`)
