import { defineUserConfig } from "vuepress"
import type { DefaultThemeOptions } from "vuepress"
import { description } from "../../package.json"

export default defineUserConfig<DefaultThemeOptions>({
  lang: "en-US",
  title: "Reaccord",
  description,
  base: "/reaccord/",
  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
  ],
  themeConfig: {
    repo: "djobbo/reaccord",
    editLinks: false,
    docsDir: "docs/guide",
    smoothScroll: true,
    editLinkText: "Edit this page on GitHub",
    lastUpdated: true,
    contributors: false,
    navbar: [
      {
        text: "Guide",
        link: "/guide/",
      },
    ],
    sidebar: [
      {
        text: "Guide",
        children: ["/guide/", "/guide/typescript/", "/guide/Client"],
      },
      {
        text: "Elements",
        children: [
          "/elements/content/",
          "/elements/embed",
          "/elements/action-row",
        ],
      },
      {
        text: "Hooks",
        children: ["/hooks/useMessageCtx/", "/hooks/useReplyEffect/"],
      },
      {
        text: "Examples",
        children: ["/examples/counter/"],
      },
    ],
  },
  plugins: [
    ["@vuepress/back-to-top", true],
    [
      "@vuepress/pwa",
      {
        serviceWorker: true,
        updatePopup: true,
      },
    ],
    [
      "@vuepress/plugin-search",
      {
        locales: {
          "/": {
            placeholder: "Search",
          },
        },
        isSearchable: (page) => page.path !== "/",
      },
    ],
  ],
})
