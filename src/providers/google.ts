import { Storage, type Bucket } from "@google-cloud/storage";
import type { Writable } from "stream";
import { PassThrough } from "stream";
import type { StorageProvider } from "./interface.js";

export type GoogleProviderConfig = {
  domain: string;
  bucket: string;
  keyFilename: string;
  projectId?: string;
};

class GoogleStorageProvider implements StorageProvider {
  bucket: Bucket;

  constructor(config: GoogleProviderConfig) {
    const storage = new Storage({
      projectId: config.projectId,
      keyFilename: config.keyFilename,
    });
    this.bucket = storage.bucket(config.bucket);
  }

  write(file: string): Writable {
    // console.info(`publishing file: ${file}`);

    const fileRef = this.bucket.file(file);
    const passthroughStream = new PassThrough();
    passthroughStream.pipe(fileRef.createWriteStream()).on("finish", () => {
      console.info(`file: ${file} uploaded to bucket.`);
      // The file upload is complete
    });

    return passthroughStream;
  }

  async has(file: string): Promise<boolean> {
    const exists = (await this.bucket.file(file).exists())[0];
    return exists;
  }
}

export default GoogleStorageProvider;
