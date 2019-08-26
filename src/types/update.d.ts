type GausUpdateId = string;

interface GausMetadata {
  [key: string]: string;
}
interface GausUpdate {
  updateId: GausUpdateId;
  metadata: GausMetadata;
  size: number;
  downloadUrl: string;
  version: string;
  packageType: string;
  updateType: string;
  md5: string;
}
