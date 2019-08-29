import { GausError } from './helpers/gaus-error';
import requestPromise = require('request-promise');

export class GausClient {
  private _serverUrl: string;
  private _session: GausSession;

  private _REGISTER_ENDPOINT = '/register';
  private _AUTHENTICATE_ENDPOINT = '/authenticate';

  constructor(serverUrl: string) {
    this._serverUrl = serverUrl;
  }

  register(
    productAuthParameters: GausProductAuthParameters,
    deviceId: UserDeviceId
  ): Promise<{ pollInterval: number; deviceAuthParameters: GausDeviceAuthParameters } | void> {
    if (productAuthParameters && productAuthParameters.accessKey && productAuthParameters.secretKey && deviceId) {
      const reqOpt = {
        uri: this._serverUrl + this._REGISTER_ENDPOINT,
        method: 'POST',
        body: { productAuthParameters, deviceId },
        json: true,
      };
      return requestPromise(reqOpt)
        .then(
          (
            registerResponse: { pollInterval: number; deviceAuthParameters: GausDeviceAuthParameters } | void
          ): { pollInterval: number; deviceAuthParameters: GausDeviceAuthParameters } | void => registerResponse
        )
        .catch(
          (error: Error): void => {
            throw error;
          }
        );
    } else {
      return Promise.reject('In parameter(s) not defined');
    }
  }

  checkForUpdates(deviceAuthParameters: GausDeviceAuthParameters): Promise<GausUpdate[] | void> {
    return Promise.resolve()
      .then(
        (): Promise<void | GausSession> => {
          if (!this._session) {
            return this._authenticate(deviceAuthParameters);
          }
          return Promise.resolve();
        }
      )
      .then(
        (): requestPromise.RequestPromise => {
          const reqOpt = {
            uri: this._serverUrl + this._checkForUpdateEndpoint(this._session.productGUID, this._session.deviceGUID),
            headers: {
              Authorization: `Bearer ${this._session.token}`,
            },
            json: true,
          };

          return requestPromise(reqOpt);
        }
      )
      .then((updates: GausUpdate[]): GausUpdate[] => updates)
      .catch(
        (error: Error): void => {
          throw error;
        }
      );
  }

  report(deviceAuthParameters: GausDeviceAuthParameters, report: GausReport): Promise<void> {
    return Promise.resolve()
      .then(
        (): Promise<void | GausSession> => {
          if (!this._session) {
            return this._authenticate(deviceAuthParameters);
          }
          return Promise.resolve();
        }
      )
      .then(
        (): requestPromise.RequestPromise => {
          if (!report || !report.data || !report.header || !report.version) {
            throw new GausError('In parameter(s) not defined');
          }

          const reqOpt = {
            uri: this._serverUrl + this._reportEndpoint(this._session.productGUID, this._session.deviceGUID),
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this._session.token}`,
            },
            body: report,
            json: true,
          };
          return requestPromise(reqOpt);
        }
      )
      .then((): void => {})
      .catch(
        (error: Error): void => {
          throw error;
        }
      );
  }

  private _authenticate(deviceAuthParameters: GausDeviceAuthParameters): Promise<GausSession | void> {
    if (deviceAuthParameters && deviceAuthParameters.accessKey && deviceAuthParameters.secretKey) {
      const reqOpt = {
        uri: this._serverUrl + this._AUTHENTICATE_ENDPOINT,
        method: 'POST',
        body: { deviceAuthParameters },
        json: true,
      };
      return requestPromise(reqOpt)
        .then(
          (authenticateResponse: GausSession): GausSession => {
            this._session = authenticateResponse;
            return authenticateResponse;
          }
        )
        .catch(
          (error: Error): void => {
            throw error;
          }
        );
    } else {
      throw new GausError('In parameter(s) not defined');
    }
  }

  private _checkForUpdateEndpoint(productGUID: GausProductGUID, deviceGUID: GausDeviceGUID): string {
    return '/device/' + productGUID + '/' + deviceGUID + '/check-for-updates';
  }
  private _reportEndpoint(productGUID: GausProductGUID, deviceGUID: GausDeviceGUID): string {
    return '/device/' + productGUID + '/' + deviceGUID + '/report';
  }
}
