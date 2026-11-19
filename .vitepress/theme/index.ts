// Go Mode documentation theme with shared typography and native screenshot presentation.
import DefaultTheme from "vitepress/theme-without-fonts";
import type { Theme } from "vitepress";
import ThemedScreenshot from "./ThemedScreenshot.vue";
import "./style.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("ThemedScreenshot", ThemedScreenshot);
  },
} satisfies Theme;
