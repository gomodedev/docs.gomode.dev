// Vue single-file components are compiled by VitePress.
declare module "*.vue" {
  import type { Component } from "vue";
  const component: Component;
  export default component;
}
