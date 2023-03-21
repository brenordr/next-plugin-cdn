import type { NextConfig } from "next";

import { NextJSCDNPlugin } from "./plugin";

type ProviderConfig = {
  cdn:
    | {
        domain: string;

        provider: "google";

        bucket: string;
        keyFilename: string;
      }
    | {
        domain: string;

        provider: "aws";
      };
};

const isProd = process.env.NODE_ENV === "production";

export default function withCDN(
  config: NextConfig & ProviderConfig
): NextConfig {
  return {
    ...config,

    // Note assetPrefix is only used in production since it's not needed in development
    // and it's overwriten.
    assetPrefix: isProd ? config.cdn.domain : undefined,
    webpack: (config, { dev }) => {
      config.plugins.push(
        new NextJSCDNPlugin({
          dev,
        })
      );
      return config;
    },
  };
}

// const test = withCDN({
//   cdn: {
//     domain: "https://cdn.justmagic.dev",
//     provider: "google",
//     bucket: "justmagic-bucket",
//     keyFilename: "bucket-key.json",
//   },

//   output: "standalone",
//   reactStrictMode: true,
//   swcMinify: true,
//   experimental: {
//     appDir: true,
//   },
// });
