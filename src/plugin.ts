import { PassThrough, Writable } from "stream";
import { type Compiler } from "webpack";
import { StorageProvider } from "./providers/interface.js";

class DummyStorageProvider implements StorageProvider {
  // This is a dummy provider. It does nothing.
  // You can use this as a template to create your own provider.
  write(file: string) {
    console.error("Method not implemented. This is a dummy provider.");
    return new Writable();
  }
  async has(file: string): Promise<boolean> {
    return true;
  }
}

interface Config {
  dev?: boolean;
  storage?: StorageProvider;
}

export class NextCDNPlugin {
  config: Required<Config>;

  constructor(options?: Config) {
    this.config = {
      dev: false,
      storage: new DummyStorageProvider(), // default provider. should never be used
      ...options,
    };
  }

  apply(compiler: Compiler) {
    if (this.config.dev) {
      return;
    }

    const { storage } = this.config;

    compiler.hooks.assetEmitted.tapPromise(
      "NextCDNPlugin",
      (file: string, { content }: any) => {
        return new Promise((resolve, reject) => {
          if (/static/g.test(file)) {
            // This is a hack to fix the path of the file.
            if (/\/static/g.test(file)) {
              file = file.replace("/static", "static");
            }

            storage.has(`_next/${file}`).then((exists) => {
              if (exists) {
                // file already exits in storage. skip upload
                // in future, we can check if the file has changed and re-upload
                // or we can force re-upload by deleting the file first
                resolve();
                // console.warn(`\x1b[35mcdn\x1b[0m  - Skipped uploading ${file}`);
                return;
              }

              const fileRef = storage.write(`_next/${file}`);

              const passthroughStream = new PassThrough();
              passthroughStream.write(content);
              passthroughStream.end();

              passthroughStream
                .pipe(fileRef)
                .on("finish", () => {
                  console.info(`\x1b[35mcdn\x1b[0m   - Uploaded ${file}`);
                  resolve();
                })
                .on("error", (err) => {
                  console.error(
                    `\x1b[35mcdn\x1b[0m   - Failed to uploaded ${file}`
                  );
                  reject(err);
                });
            });
          }

          resolve();
        });
      }
    );
  }
}
