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

  checkForUpdates(deviceAuthParameters: GausDeviceAuthParameters): GausUpdate[] {
    if (!this._session) {
      this._authenticate(deviceAuthParameters);
    }

    try {
      // Make check-for-updates GET call
      return [];
    } catch (error) {
      // if error is 401 Authentication denined, auto authenticate
      this._authenticate(deviceAuthParameters);
      // Make check-for-updates GET call
      return [];

      // else
      throw error;
    }
  }

  report(deviceAuthParameters: GausDeviceAuthParameters, report: GausReport): void {
    if (!this._session) {
      this._authenticate(deviceAuthParameters);
    }

    if (!report || !report.data || !report.header || !report.version) {
      throw new GausError('In parameters not defined');
    }

    try {
      // Make report POST call
    } catch (error) {
      // if error is 401 Authentication denined, auto authenticate
      this._authenticate(deviceAuthParameters);
      // Make report POST call

      // else
      throw error;
    }
  }

  private _authenticate(deviceAuthParameters: GausDeviceAuthParameters): void {
    if (deviceAuthParameters && deviceAuthParameters.accessKey && deviceAuthParameters.secretKey) {
      // Make authenticate POST call
      this._deviceAuthParameters = deviceAuthParameters;
      this._session = { deviceGUID: '', productGUID: '', token: '' }; // Dummy code
    } else {
      throw new GausError('Device authentication parameters not specified');
    }
  }
}
