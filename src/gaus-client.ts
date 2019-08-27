export class GausClient {
  private _deviceAuthParameters: GausDeviceAuthParameters;
  private _session: GausSession;

  constructor() {}

  register(
    productAuthParameters: GausProductAuthParameters,
    deviceId: GausDeviceId
  ): { pollInterval: GausPollIntervalSeconds; deviceAuthParameters: GausDeviceAuthParameters } {
    if (productAuthParameters && productAuthParameters.accessKey && productAuthParameters.secretKey && deviceId) {
      return { pollInterval: 1, deviceAuthParameters: { accessKey: '', secretKey: '' } }; // Dummy code
    } else {
      const error: GausError = { description: 'In parameters not defined' };
      throw error;
    }
  }

  authenticate(deviceAuthParameters: GausDeviceAuthParameters): void {
    if (deviceAuthParameters && deviceAuthParameters.accessKey && deviceAuthParameters.secretKey) {
      this._deviceAuthParameters = deviceAuthParameters;
      this._session = { deviceGUID: '', productGUID: '', token: '' }; // Dummy code
    } else {
      const error: GausError = { description: 'In parameters not defined' };
      throw error;
    }
  }

  checkForUpdates(): GausUpdate[] {
    if (this._session) {
      return []; // Dummy code
    } else if (this._deviceAuthParameters) {
      // auto authenticate
    } else {
      const error: GausError = { description: 'No session or device auth params' };
      throw error;
    }
  }

  report(deviceGUID: GausDeviceGUID, productGUID: GausProductGUID, report: GausReport): void {
    if (deviceGUID && productGUID && report && report.data && report.header && report.version) {
      if (this._session) {
      } else if (this._deviceAuthParameters) {
        // auto authenticate here
      } else {
        const error: GausError = { description: 'No session or device auth params' };
        throw error;
      }
    } else {
      const error: GausError = { description: 'In parameters not defined' };
      throw error;
    }
  }
}
