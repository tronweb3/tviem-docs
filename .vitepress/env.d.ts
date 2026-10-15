// `tsc --noEmit` type-checks the theme entry, which imports stylesheets and
// Vue single-file components that only Vite understands.
declare module '*.css'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
