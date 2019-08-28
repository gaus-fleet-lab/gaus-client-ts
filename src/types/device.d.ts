type UserDeviceId = string;
type GausDeviceGUID = string;
type GausDeviceAccessKey = string;
type GausDeviceSecretKey = string;

interface GausDeviceAuthParameters {
  accessKey: GausDeviceAccessKey;
  secretKey: GausDeviceAccessKey;
}
