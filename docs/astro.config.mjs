import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import tailwind from "@astrojs/tailwind"

export default defineConfig({
  site: "https://reaccord.djobbo.com",
  integrations: [
    starlight({
      title: "Reaccord Docs",
      editLink: {
        baseUrl: "https://github.com/djobbo/reaccord/edit/master/docs/",
      },
      social: {
        github: "https://github.com/djobbo/reaccord",
      },
      sidebar: [
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
      ],
      customCss: ["./src/tailwind.css"],
      logo: {
        dark: "./src/assets/reaccord-logo-dark.svg",
        light: "./src/assets/reaccord-logo-light.svg",
        alt: "Reaccord Logo",
      },
      favicon: "/src/assets/reaccord-logo.svg",
    }),
    tailwind({ applyBaseStyles: false }),
  ],
})
