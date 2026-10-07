// Go Mode documentation navigation, local search, metadata, and static-site configuration.
import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Go Mode",
  description: "Native Android and voice for backend-hosted web applications.",
  lang: "en-US",
  cleanUrls: true,
  srcExclude: ["AGENTS.md", "README.md", "node_modules/**", "playwright-report/**", "test-results/**"],
  sitemap: { hostname: "https://docs.gomode.dev" },
  head: [
    ["link", { rel: "icon", href: "/favicon.svg" }],
    ["meta", { name: "theme-color", content: "#126b57" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "Go Mode documentation" }],
  ],
  transformHead: ({ pageData }) => [
    [
      "link",
      {
        rel: "canonical",
        href: `https://docs.gomode.dev/${pageData.relativePath.replace(/index\.md$/, "").replace(/\.md$/, "")}`,
      },
    ],
    ["meta", { property: "og:title", content: `${pageData.title || "Documentation"} — Go Mode` }],
    [
      "meta",
      {
        property: "og:description",
        content: pageData.description || "Android setup, host integration, and voice for Go Mode.",
      },
    ],
  ],
  themeConfig: {
    logo: "/favicon.svg",
    siteTitle: "Go Mode / docs",
    nav: [
      { text: "Android app", link: "/guide/android" },
      { text: "Build a host", link: "/guide/host" },
      { text: "gomode.dev ↗", link: "https://gomode.dev" },
    ],
    sidebar: [
      {
        text: "Get started",
        items: [
          { text: "Overview", link: "/guide/" },
          { text: "Android setup", link: "/guide/android" },
          { text: "Troubleshooting", link: "/guide/troubleshooting" },
        ],
      },
      {
        text: "Build with Go Mode",
        items: [
          { text: "Host integration", link: "/guide/host" },
          { text: "Authentication", link: "/guide/authentication" },
          { text: "MCP and skills", link: "/guide/skills" },
          { text: "Voice gateway", link: "/guide/voice" },
          { text: "Architecture", link: "/guide/architecture" },
          { text: "SDKs and browser integration", link: "/guide/sdk" },
        ],
      },
    ],
    search: { provider: "local" },
    socialLinks: [{ icon: "github", link: "https://github.com/maruel/gomode" }],
    editLink: {
      pattern: "https://github.com/gomodedev/docs.gomode.dev/edit/main/:path",
      text: "Edit this page on GitHub",
    },
    footer: {
      message: "Go Mode owns the shell. Your host owns the product.",
      copyright: 'Open source · <a href="https://gomode.dev">gomode.dev</a>',
    },
  },
});
