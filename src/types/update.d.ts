type GausUpdateGUID = string;

interface GausMetadata {
  [key: string]: string;
}
interface GausUpdate {
  updateId: GausUpdateGUID;
  metadata: GausMetadata;
  size: number;
  downloadUrl: string;
  version: string; // use update type lib?
  packageType: string;
  updateType: string;
  md5: string;
}
