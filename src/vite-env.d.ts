/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_UID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
