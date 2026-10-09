import "i18next";

import type common from "./locales/es/common.json";
import type auth from "./locales/es/auth.json";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      common: typeof common;
      auth: typeof auth;
    };
  }
}
