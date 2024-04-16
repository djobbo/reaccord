import { type Context, DEFAULT_REF } from "./context.js"

import { color } from "@astrojs/cli-kit"
import { downloadTemplate } from "giget"
import { readFile, writeFile } from "node:fs/promises"
import fs from "node:fs"
import path from "node:path"

export const getTemplateTarget = (tmpl: string, ref = DEFAULT_REF) => {
  const isThirdParty = tmpl.includes("/")
  if (isThirdParty) return tmpl

  return `github:djobbo/reaccord/examples/${tmpl}#${ref}`
}

const FILES_TO_UPDATE = {
  "package.json": (file: string, overrides: { name: string }) =>
    readFile(file, "utf-8").then((value) => {
      // Match first indent in the file or fallback to `\t`
      const indent = /(^\s+)/m.exec(value)?.[1] ?? "\t"

      return writeFile(
        file,
        JSON.stringify(
          {
            ...JSON.parse(value),
            ...overrides,
            private: undefined,
          },
          null,
          indent,
        ),
        "utf-8",
      )
    }),
}

export const copyTemplate = async (tmpl: string, ctx: Context) => {
  const templateTarget = getTemplateTarget(tmpl, ctx.ref)

  if (ctx.dryRun) return

  try {
    await downloadTemplate(templateTarget, {
      force: true,
      provider: "github",
      cwd: ctx.cwd,
      dir: ".",
    })
  } catch (err: any) {
    // Only remove the directory if it's most likely created by us.
    if (ctx.cwd !== "." && ctx.cwd !== "./" && !ctx.cwd.startsWith("../")) {
      try {
        fs.rmdirSync(ctx.cwd)
      } catch (_) {
        // Ignore any errors from removing the directory,
        // make sure we throw and display the original error.
      }
    }

    throw new Error(err)

    if (err.message.includes("404")) {
      throw new Error(
        `Template ${color.reset(tmpl)} ${color.dim("does not exist!")}`,
      )
    } else {
      throw new Error(err.message)
    }
  }

  // It's possible the repo exists (ex. `djobbo/reaccord`),
  // But the template route is invalid (ex. `djobbo/reaccord/examples/DNE`).
  // `giget` doesn't throw for this case,
  // so check if the directory is still empty as a heuristic.
  if (fs.readdirSync(ctx.cwd).length === 0) {
    throw new Error(`Template ${color.reset(tmpl)} ${color.dim("is empty!")}`)
  }

  const updateFiles = Object.entries(FILES_TO_UPDATE).map(
    async ([file, update]) => {
      const fileLoc = path.resolve(path.join(ctx.cwd, file))
      if (fs.existsSync(fileLoc)) {
        return update(fileLoc, { name: ctx.projectName! })
      }
    },
  )

  await Promise.all(updateFiles)
}
