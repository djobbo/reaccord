import fs from "node:fs"
import path from "node:path"

import { $, cd } from "zx"
import { color } from "@astrojs/cli-kit"
import { error, info, title } from "../helpers/messages.js"
import type { Context } from "../helpers/context.js"

const init = async ({ cwd }: { cwd: string }) => {
  try {
    $.cwd = cwd
    cd(cwd)
    await $`git init`
  } catch (e) {}
}

export const initGit = async (ctx: Context) => {
  if (fs.existsSync(path.join(ctx.cwd, ".git"))) {
    await info("Nice!", `Git has already been initialized`)
    return
  }

  let _git = ctx.git ?? ctx.yes
  if (_git === undefined) {
    ;({ git: _git } = await ctx.prompt({
      name: "git",
      type: "confirm",
      label: title("git"),
      message: `Initialize a new git repository?`,
      hint: "optional",
      initial: true,
    }))
  }

  if (ctx.dryRun) {
    await info("--dry-run", `Skipping Git initialization`)
  } else if (_git) {
    ctx.tasks.push({
      pending: "Git",
      start: "Git initializing...",
      end: "Git initialized",
      while: () =>
        init({ cwd: ctx.cwd }).catch((e) => {
          error("error", e)
          process.exit(1)
        }),
    })
  } else {
    await info(
      ctx.yes === false ? "git [skip]" : "Sounds good!",
      `You can always run ${color.reset("git init")}${color.dim(" manually.")}`,
    )
  }
}
