type GausDeviceId = string;
type GausDeviceGUID = string;
type GausPollIntervalSeconds = number;
type GausDeviceAccessKey = string;
type GausDeviceSecretKey = string;

interface GausDeviceAuthParameters {
  accessKey: GausDeviceAccessKey;
  secretKey: GausDeviceAccessKey;
}
