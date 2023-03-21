import { Storage, type Bucket } from "@google-cloud/storage";
import type { Writable } from "stream";
import { PassThrough } from "stream";
import type { StorageProvider } from "./interface";

class GoogleStorageProvider implements StorageProvider {
  bucket: Bucket;

  constructor() {
    const storage = new Storage({ keyFilename: "bucket-key.json" });
    this.bucket = storage.bucket("justmagic-bucket");
  }

  write(file: string): Writable {
    const fileRef = this.bucket.file(`_next/${file}`);
    const passthroughStream = new PassThrough();
    passthroughStream.pipe(fileRef.createWriteStream()).on("finish", () => {
      // The file upload is complete
    });

    return passthroughStream;
  }

  async has(file: string): Promise<boolean> {
    const data = await this.bucket.file(`_next/${file}`).exists();
    return data[0];
  }
}

export default GoogleStorageProvider;
