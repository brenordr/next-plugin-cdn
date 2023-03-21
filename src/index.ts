import type { NextConfig } from "next";

import { NextJSCDNPlugin } from "./plugin.js";
import GoogleStorageProvider, {
  GoogleProviderConfig,
} from "./providers/google.js";

export default function withCDN(
  cdnConfig: GoogleProviderConfig
): (config: NextConfig) => NextConfig {
  return (config) => ({
    ...config,

    // Note assetPrefix is only used in production since it's not needed in development
    // and it's overwriten.
    assetPrefix: cdnConfig.domain,
    webpack: (config, { dev }) => {
      config.plugins.push(
        new NextJSCDNPlugin({
          dev,
          storage: new GoogleStorageProvider(cdnConfig),
        })
      );
      return config;
    },
  });
}
