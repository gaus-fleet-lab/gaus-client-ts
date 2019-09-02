interface RegisterRequest {
  productAuthParameters: GausProductAuthParameters;
  deviceId: UserDeviceId;
}

interface AuthenticateRequest {
  deviceAuthParameters: GausDeviceAuthParameters;
}

interface ReportRequest {
  data: GausReportData[];
  header: GausReportHeader;
  version: GausReportVersion;
}
