interface RegisterResponse {
  pollInterval: number;
  deviceAuthParameters: GausDeviceAuthParameters;
}

interface AuthenticationResponse {
  deviceGUID: string;
  productGUID: string;
  token: string;
}

interface CheckForUpdateResponse {
  updates: GausUpdate[];
}
