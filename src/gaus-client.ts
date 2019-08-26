export class GausClient {
  constructor() {}

  register(
    productAuthParameters: GausProductAuthParameters,
    deviceId: GausDeviceId
  ): { pollInterval: GausPollIntervalSeconds; deviceAuthParameters: GausDeviceAuthParameters } {
    console.log(productAuthParameters); // to make the linter happy
    console.log(deviceId); // to make the linter happy

    return { pollInterval: 1, deviceAuthParameters: { accessKey: '', secretKey: '' } }; // Dummy code
  }

  authenticate(deviceAuthParameters: GausDeviceAuthParameters): GausSession {
    console.log(deviceAuthParameters); // to make the linter happy

    return { deviceGUID: '', productGUID: '', token: '' }; // Dummy code
  }

  checkForUpdates(session: GausSession): GausUpdate[] {
    console.log(session); // to make the linter happy

    return []; // Dummy code
  }

  report(session: GausSession, report: GausReport): void {
    console.log(session); // to make the linter happy
    console.log(report); // to make the linter happy
  }
}
