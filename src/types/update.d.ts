type GausUpdateId = string;
type GausMetadata = { [key: string]: string };
type GausUpdate = {
  updateId: GausUpdateId;
  metadata: GausMetadata;
  size: number;
  downloadUrl: string;
  version: string;
  packageType: string;
  updateType: string;
  md5: string;
};
