#! /usr/bin/env node
import { build } from "./build"
import { defineConfig } from "rollup"
import { dev } from "./dev"
import { start } from "./start"
import typescript from "@rollup/plugin-typescript"
import type { ReaccordConfig } from "./types"

const pkg = require("../package.json")

const rollupConfig = defineConfig({
    input: "src/main.js",
    output: {
        file: "./.reaccord/bot.js",
        format: "cjs",
    },
    plugins: [typescript()],
})

const main = async () => {
    const [, , command = "dev"] = process.argv
    const { version } = pkg

    if (["-v", "--version", "version"].includes(command)) {
        console.info(`@reaccord/cli v${version}`)
        process.exit(0)
    }

    let reaccordConfig: ReaccordConfig = {}
    try {
        reaccordConfig = require(`${process.cwd()}/reaccord.config.js`)
    } catch (e) {
        console.error(Error("Couldn't find a `reaccord.config.js` file"))
        process.exit(1)
    }

    process.env.REACCORD_CLI_VERSION = version
    process.env.NODE_ENV = "production"

    const { entry } = reaccordConfig
    if (!entry) {
        console.error(
            Error("Entry point not specified in `reaccord.config.js`"),
        )
        process.exit(1)
    }

    switch (command) {
        case "dev": {
            dev(entry)
            break
        }
        case "build": {
            build(rollupConfig, reaccordConfig)
            break
        }
        case "start": {
            start(rollupConfig, reaccordConfig)
            break
        }
        default:
            console.error(new Error("Command not recognized"))
            process.exit(1)
    }
}

main()
