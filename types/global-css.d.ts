// Declarations for side-effect CSS imports used in the project
declare module '*.css'
declare module '*.scss'
declare module '*.sass'

// Some packages import specific CSS files (Leaflet, etc.)
declare module 'leaflet/dist/leaflet.css'

// Allow import of CSS modules if present
declare module '*.module.css'
declare module '*.module.scss'

export {}
