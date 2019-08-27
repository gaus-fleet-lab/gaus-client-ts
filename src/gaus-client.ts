export class GausClient {
  private _session: GausSession;

  constructor(session?: GausSession) {
    this._session = session || undefined;
  }

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

  authenticate(deviceAuthParameters: GausDeviceAuthParameters): GausSession {
    if (deviceAuthParameters && deviceAuthParameters.accessKey && deviceAuthParameters.secretKey) {
      return { deviceGUID: '', productGUID: '', token: '' }; // Dummy code
    } else {
      const error: GausError = { description: 'In parameters not defined' };
      throw error;
    }
  }

  checkForUpdates(): GausUpdate[] {
    if (this._session) {
      return []; // Dummy code
    } else {
      const error: GausError = { description: 'No session initiated' };
      throw error;
    }
  }

  report(deviceGUID: GausDeviceGUID, productGUID: GausProductGUID, report: GausReport): void {
    if (this._session) {
      if (deviceGUID && productGUID && report && report.data && report.header && report.version) {
      } else {
        const error: GausError = { description: 'In parameters not defined' };
        throw error;
      }
    } else {
      const error: GausError = { description: 'No session initiated' };
      throw error;
    }
  }
}
