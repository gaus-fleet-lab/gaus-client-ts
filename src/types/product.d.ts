type GausProductGUID = string;
type GausProductAccessKey = string;
type GausProductSecretKey = string;

interface GausProductAuthParameters {
  accessKey: GausProductAccessKey;
  secretKey: GausProductSecretKey;
}
