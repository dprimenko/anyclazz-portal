interface ImportMetaEnv {
  readonly API_URL: string
  readonly PUBLIC_STRIPE_PUBLISHABLE_KEY: string
  readonly BUNNY_STORAGE_ZONE_NAME: string
  readonly BUNNY_STORAGE_API_KEY: string
  readonly BUNNY_CDN_BASE_URL: string
  readonly MAILER_DSN: string
  readonly EMAIL_FROM: string
  readonly EMAIL_CONTACT_TO: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}