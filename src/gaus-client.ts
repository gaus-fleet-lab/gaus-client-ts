export class GausClient {
  constructor() {}

  register(
    productAuthParameters: GausProductAuthParameters,
    deviceId: GausDeviceId
  ): { pollInterval: GausPollIntervalSeconds; deviceAuthParameters: GausDeviceAuthParameters } {
    return { pollInterval: 1, deviceAuthParameters: { accessKey: '', secretKey: '' } }; // Dummy code
  }

  authenticate(deviceAuthParameters: GausDeviceAuthParameters): GausSession {
    return { deviceGUID: '', productGUID: '', token: '' }; // Dummy code
  }

  checkForUpdates(session: GausSession): GausUpdate[] {
    return []; // Dummy code
  }

  report(session: GausSession, report: GausReport): void {}
}
