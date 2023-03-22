# Next.js Plugin CDN 🌐

This library is a plugin for Next.js that automatically uploads your static assets to a specified CDN during build time and configures your Next.js application to use the specified CDN prefix. This makes it easy to set up and optimize your assets for better performance.

Currently, it supports Google Cloud Storage, but support is planned to other CDNs such as AWS S3, Cloudflare, and more in the future! 🌟

## 📦 Installation

Install the package using your favorite package manager:

```bash
npm install next-plugin-cdn
```

or 

```bash
yarn add next-plugin-cdn
```

## 🔧 Usage
Set the appropriate environment variables for your project.

In your next.config.js, import the plugin and use it to configure your application:

```javascript

// Import the plugin and pass cdn info and credentials
// for example using env vars:
const withCDN = require("next-plugin-cdn").default({
  domain: process.env.NODE_ENV === "production" && process.env.CDN_DOMAIN,
  provider: process.env.CDN_PROVIDER,
  bucket: process.env.CDN_BUCKET,
  keyFilename: process.env.CDN_KEY_FILENAME,
});


// Then just apply to your nextjs config
/** @type {import('next').NextConfig} */
const nextConfig = withCDN({
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
});

module.exports = nextConfig;
```

Now, during the build process, the plugin will upload your static assets to the specified CDN and configure your Next.js application to use the CDN prefix. 🎉

## ⚙️ Options
The withCDN function accepts an object with the following properties:

`domain`: The domain of your CDN. This should be set to the value of the CDN_DOMAIN environment variable.
`provider`: The CDN provider you are using (e.g., google, aws, cloudflare, etc.). This should be set to the value of the CDN_PROVIDER environment variable.
`bucket`: The name of the bucket where your assets will be uploaded. This should be set to the value of the CDN_BUCKET environment variable.
`keyFilename`: The name of the JSON key file used for authentication with the CDN provider. This should be set to the value of the CDN_KEY_FILENAME environment variable.

These options are passed to the plugin, which then takes care of uploading the assets and configuring the CDN prefix. 🛠️

## 🛣️ Roadmap
- [ ] Google Cloud Storage support
- [ ] AWS S3 support
- [ ] Cloudflare support
- [ ] Other CDNs support (let me know if others are interesting)

Stay tuned for more CDN provider support! 🚧

## 📄 License

MIT License