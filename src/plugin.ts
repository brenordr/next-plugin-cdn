import { webpack } from "next/dist/compiled/webpack/webpack.js";
import stream from "stream";
import { StorageProvider } from "./providers/interface.js";

class MyStorageProvider implements StorageProvider {
  write(file: string) {
    return new stream.Writable();
    // throw new Error("Method not implemented.");
  }
  async has(file: string): Promise<boolean> {
    return true;
  }
}

interface Config {
  dev?: boolean;
  storage?: StorageProvider;
}

// Those go to the storage provider
// bucket: "justmagic-bucket",
// keyFilename: "bucket-key.json",

export class NextJSCDNPlugin {
  config: Required<Config>;

  constructor(options?: Config) {
    this.config = {
      dev: false,
      storage: new MyStorageProvider(), // default provider
      ...options,
    };

    console.log("NextJSCDNPlugin constructor");
  }

  apply(compiler: webpack.Compiler) {
    if (this.config.dev) {
      return;
    }

    const { storage } = this.config;

    compiler.hooks.assetEmitted.tap(
      "NextJSCDNPlugin",
      (file: string, { content }: any) => {
        if (/static/g.test(file)) {
          console.log(file);

          storage.has(`_next/${file}`).then((exists) => {
            if (exists) {
              // file already exits in storage. skip upload
              // in future, we can check if the file has changed and re-upload
              // or we can force re-upload by deleting the file first
              return;
            }

            const fileRef = storage.write(`_next/${file}`);

            const passthroughStream = new stream.PassThrough();
            passthroughStream.write(content);
            passthroughStream.end();

            passthroughStream.pipe(fileRef).on("finish", () => {
              console.log(`${`_next/${file}`} uploaded to bucket.`);
            });
          });
        }
      }
    );
  }
}
