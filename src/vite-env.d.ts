/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_STORAGE_SECRET: string;
  // Add more custom variables here...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
