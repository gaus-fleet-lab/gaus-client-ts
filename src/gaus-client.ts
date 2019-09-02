import * as requestPromise from 'request-promise';

export class GausClient {
  private _serverUrl: string;
  private _session: GausSession;

  private _REGISTER_ENDPOINT = '/register';
  private _AUTHENTICATE_ENDPOINT = '/authenticate';

  constructor(serverUrl: string) {
    this._serverUrl = serverUrl;
  }

  register(registerRequestParameters: RegisterRequest): Promise<RegisterResponse | void> {
    if (
      !registerRequestParameters ||
      !registerRequestParameters.productAuthParameters ||
      !registerRequestParameters.productAuthParameters.accessKey ||
      !registerRequestParameters.productAuthParameters.secretKey ||
      !registerRequestParameters.deviceId
    ) {
      return Promise.reject('In parameter(s) not defined');
    }

    const reqOpt = {
      uri: `${this._serverUrl}${this._REGISTER_ENDPOINT}`,
      method: 'POST',
      body: registerRequestParameters,
      json: true,
    };
    console.log('IS MOCK: ', JSON.stringify((requestPromise as any)._isMockFunction));
    return requestPromise(reqOpt).promise();
  }

  checkForUpdates(deviceAuthParameters: GausDeviceAuthParameters): Promise<CheckForUpdateResponse | void> {
    return Promise.resolve()
      .then(
        (): Promise<GausSession | void> => {
          if (!this._session) {
            return this._authenticate({ deviceAuthParameters });
          }
          return Promise.resolve();
        }
      )
      .then(
        (): Promise<CheckForUpdateResponse> => {
          const reqOpt = {
            uri: `${this._serverUrl}${this._checkForUpdateEndpoint(
              this._session.productGUID,
              this._session.deviceGUID
            )}`,
            headers: {
              Authorization: `Bearer ${this._session.token}`,
            },
            json: true,
          };
          return requestPromise(reqOpt).promise();
        }
      );
  }

  report(deviceAuthParameters: GausDeviceAuthParameters, reportRequest: ReportRequest): Promise<void> {
    return Promise.resolve()
      .then(
        (): Promise<GausSession | void> => {
          if (!this._session) {
            return this._authenticate({ deviceAuthParameters });
          }
          return Promise.resolve();
        }
      )
      .then(
        (): Promise<void> => {
          if (!reportRequest || !reportRequest.data || !reportRequest.header || !reportRequest.version) {
            return Promise.reject('In parameter(s) not defined');
          }

          const reqOpt = {
            uri: `${this._serverUrl}${this._reportEndpoint(this._session.productGUID, this._session.deviceGUID)}`,
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this._session.token}`,
            },
            body: reportRequest,
            json: true,
          };
          return requestPromise(reqOpt).promise();
        }
      );
  }

  private _authenticate(authenticationRequest: AuthenticateRequest): Promise<GausSession | void> {
    if (
      !authenticationRequest ||
      !authenticationRequest.deviceAuthParameters ||
      !authenticationRequest.deviceAuthParameters.accessKey ||
      !authenticationRequest.deviceAuthParameters.secretKey
    ) {
      return Promise.reject('In parameter(s) not defined');
    }

    const reqOpt = {
      uri: `${this._serverUrl}${this._AUTHENTICATE_ENDPOINT}`,
      method: 'POST',
      body: authenticationRequest,
      json: true,
    };
    return requestPromise(reqOpt).then(
      (authenticateResponse: AuthenticationResponse): GausSession => {
        this._session = authenticateResponse;
        return this._session;
      }
    );
  }

  private _checkForUpdateEndpoint(productGUID: GausProductGUID, deviceGUID: GausDeviceGUID): string {
    return `/device/${productGUID}/${deviceGUID}/check-for-updates`;
  }
  private _reportEndpoint(productGUID: GausProductGUID, deviceGUID: GausDeviceGUID): string {
    return `/device/${productGUID}/${deviceGUID}/report`;
  }
}
