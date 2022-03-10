import { defineUserConfig } from "vuepress"
import type { DefaultThemeOptions } from "vuepress"
import { description } from "../../package.json"

export default defineUserConfig<DefaultThemeOptions>({
    lang: "en-US",
    title: "Reaccord",
    description,
    head: [
        ["meta", { name: "theme-color", content: "#3eaf7c" }],
        ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
        ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }],
    ],
    themeConfig: {
        repo: "AlfieGoldson/Reaccord",
        editLinks: false,
        docsDir: "docs/guide",
        smoothScroll: true,
        editLinkText: "Edit this page on GitHub",
        lastUpdated: true,
        navbar: [
            {
                text: "Guide",
                link: "/guide/",
            },
        ],
        sidebar: [
            {
                text: "Guide",
                children: ["/guide/", "/guide/typescript/"],
            },
            {
                text: "Elements",
                children: ["/elements/", "/elements/content/", "/elements/embed", "/elements/action-row"],
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
            '@vuepress/plugin-search',
            {
                locales: {
                    '/': {
                        placeholder: 'Search',
                    },
                },
                isSearchable: (page) => page.path !== '/',
            },
        ],
    ],
})
