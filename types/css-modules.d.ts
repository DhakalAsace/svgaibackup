declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.css' {
  const content: { readonly [key: string]: string }
  export default content
}

declare module '@/app/gallery/gallery.module.css' {
  const galleryClasses: { readonly [key: string]: string }
  export default galleryClasses
}