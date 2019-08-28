type GausToken = string;

interface GausSession {
  deviceGUID: GausDeviceGUID;
  productGUID: GausProductGUID;
  token: GausToken;
}
