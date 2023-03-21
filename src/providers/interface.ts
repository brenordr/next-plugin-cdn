import { Writable } from "stream";

export interface StorageProvider {
  write(file: string): Writable;
  has(file: string): Promise<boolean>;
  //   read(file: string): Readable;
}
