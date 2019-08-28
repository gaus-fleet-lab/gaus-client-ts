import { GausError } from './helpers/gaus-error';

export class GausClient {
  private _deviceAuthParameters: GausDeviceAuthParameters;
  private _session: GausSession;

  constructor() {}

  register(
    productAuthParameters: GausProductAuthParameters,
    deviceId: UserDeviceId
  ): { pollInterval: number; deviceAuthParameters: GausDeviceAuthParameters } {
    if (productAuthParameters && productAuthParameters.accessKey && productAuthParameters.secretKey && deviceId) {
      return { pollInterval: 1, deviceAuthParameters: { accessKey: '', secretKey: '' } }; // Dummy code
    } else {
      throw new GausError('In parameters not defined');
    }
  }

  authenticate(deviceAuthParameters: GausDeviceAuthParameters): void {
    if (deviceAuthParameters && deviceAuthParameters.accessKey && deviceAuthParameters.secretKey) {
      this._deviceAuthParameters = deviceAuthParameters;
      this._session = { deviceGUID: '', productGUID: '', token: '' }; // Dummy code
    } else {
      throw new GausError('In parameters not defined');
    }
  }

  checkForUpdates(): GausUpdate[] {
    if (this._session) {
      return []; // Dummy code
    } else if (this._deviceAuthParameters) {
      // auto authenticate
    } else {
      throw new GausError('No session or device auth params');
    }
  }

  report(deviceGUID: GausDeviceGUID, productGUID: GausProductGUID, report: GausReport): void {
    if (deviceGUID && productGUID && report && report.data && report.header && report.version) {
      if (this._session) {
      } else if (this._deviceAuthParameters) {
        // auto authenticate here
      } else {
        throw new GausError('No session or device auth params');
      }
    } else {
      throw new GausError('In parameters not defined');
    }
  }
}
