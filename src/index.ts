import type { NextConfig } from "next";

import { NextJSCDNPlugin } from "./plugin.js";
import GoogleStorageProvider from "./providers/google.js";

type ProviderConfig = {
  cdn:
    | {
        domain: string;
        provider: "google";
        bucket: string;
        keyFilename: string;
        development?: boolean;
      }
    | {
        domain: string;

        provider: "aws";
        development?: boolean;
      };
};

export default function withCDN(
  config: NextConfig & ProviderConfig
): NextConfig {
  return {
    ...config,

    // Note assetPrefix is only used in production since it's not needed in development
    // and it's overwriten.
    assetPrefix: config.cdn.development ? undefined : config.cdn.domain,
    webpack: (config, { dev }) => {
      config.plugins.push(
        new NextJSCDNPlugin({
          dev,
          storage: new GoogleStorageProvider(
            config.cdn.keyFilename,
            config.cdn.bucket
          ),
        })
      );
      return config;
    },
  };
}
