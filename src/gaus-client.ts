import * as superagent from 'superagent';

//Exported types:

//Device
export type UserDeviceId = string;
export type GausDeviceGUID = string;
export type GausDeviceAccessKey = string;
export type GausDeviceSecretKey = string;

export interface GausDeviceAuthParameters {
  accessKey: GausDeviceAccessKey;
  secretKey: GausDeviceAccessKey;
}

export interface GausDeviceConfiguration {
  pollInterval: number;
  deviceAuthParameters: GausDeviceAuthParameters;
}

//Product
export type GausProductGUID = string;
export type GausProductAccessKey = string;
export type GausProductSecretKey = string;

export interface GausProductAuthParameters {
  accessKey: GausProductAccessKey;
  secretKey: GausProductSecretKey;
}

//Report
export type GausReportVersion = string;
export type DateString = string;

export interface GausReportData {
  v_strings?: { [key: string]: string };
  v_ints?: { [key: string]: number };
  type: string;
  v_floats?: { [key: string]: number };
  tags?: { [key: string]: string };
  ts: DateString;
}
export interface GausReportHeader {
  seqNo?: number;
  ts: DateString;
  tags?: { [key: string]: string };
}
export interface GausReport {
  data: GausReportData[];
  header: GausReportHeader;
  version: GausReportVersion;
}

//Session
export type GausToken = string;

export interface GausSession {
  deviceGUID: GausDeviceGUID;
  productGUID: GausProductGUID;
  token: GausToken;
}

//Update
export type GausUpdateGUID = string;

export interface GausMetadata {
  [key: string]: string;
}
export interface GausUpdate {
  updateId: GausUpdateGUID;
  metadata: GausMetadata;
  size: number;
  downloadUrl: string;
  version: string; // FIXME GAUS-1210
  packageType: string;
  updateType: string;
  md5: string;
}

export type GausUpdateParameterName = string;
export type GausUpdateParameterValue = string;

export interface GausUpdateParameter {
  name: GausUpdateParameterName;
  value: GausUpdateParameterValue;
}

export class GausClient {
  private _serverUrl: string;
  private _session: GausSession;

  private _REGISTER_ENDPOINT = '/register';
  private _AUTHENTICATE_ENDPOINT = '/authenticate';

  private _MAX_NUMBER_OF_AUTH_RETRIES = 3;
  private _authAttempts = 0;

  constructor(serverUrl: string) {
    this._serverUrl = serverUrl;
  }

  register(productAuthParameters: GausProductAuthParameters, deviceId: UserDeviceId): Promise<GausDeviceConfiguration> {
    const requstBody = { productAuthParameters, deviceId };
    if (
      !requstBody.productAuthParameters ||
      !requstBody.productAuthParameters.accessKey ||
      !requstBody.productAuthParameters.secretKey ||
      !requstBody.deviceId
    ) {
      return Promise.reject('In parameter(s) not defined');
    }

    return superagent
      .post(`${this._serverUrl}${this._REGISTER_ENDPOINT}`)
      .send(requstBody)
      .set('accept', 'json')
      .then(result => {
        return result.body;
      });
  }

  checkForUpdates(
    deviceAuthParameters: GausDeviceAuthParameters,
    updateParameters: GausUpdateParameter[]
  ): Promise<GausUpdate[]> {
    if (!updateParameters) {
      return Promise.reject('In parameter(s) not defined');
    }

    return Promise.resolve()
      .then(
        (): Promise<GausSession> => {
          if (!this._session) {
            return this._authenticate(deviceAuthParameters);
          }
          return Promise.resolve(this._session);
        }
      )
      .then(
        (): Promise<GausUpdate[]> =>
          this._checkForUpdateTry(updateParameters).catch(
            (error: any): Promise<GausUpdate[]> => {
              if (error.statusCode && (error.statusCode === 401 || error.statusCode === 403)) {
                this._session = null;
                return this._authenticate(deviceAuthParameters).then(
                  (): Promise<GausUpdate[]> => this._checkForUpdateTry(updateParameters)
                );
              } else {
                return Promise.reject(error);
              }
            }
          )
      );
  }

  report(deviceAuthParameters: GausDeviceAuthParameters, report: GausReport): Promise<void> {
    if (!report || !report.data || !report.header || !report.version) {
      return Promise.reject('In parameter(s) not defined');
    }

    return Promise.resolve()
      .then(
        (): Promise<GausSession> => {
          if (!this._session) {
            return this._authenticate(deviceAuthParameters);
          }
          return Promise.resolve(this._session);
        }
      )
      .then(
        (): Promise<void> =>
          this._reportTry(report).catch(
            (error: any): Promise<void> => {
              if (error.statusCode && (error.statusCode === 401 || error.statusCode === 403)) {
                this._session = null;
                return this._authenticate(deviceAuthParameters).then((): Promise<void> => this._reportTry(report));
              } else {
                return Promise.reject(error);
              }
            }
          )
      );
  }

  private _checkForUpdateTry(updateParameters: GausUpdateParameter[]): Promise<GausUpdate[]> {
    let queryParamString: string = updateParameters.map(p => `${p.name}=${p.value}`).join('&');

    return superagent
      .get(`${this._serverUrl}${this._checkForUpdateEndpoint(this._session.productGUID, this._session.deviceGUID)}`)
      .query({ query: queryParamString })
      .set('Authorization', `Bearer ${this._session.token}`)
      .then(result => {
        return result.body.updates;
      });
  }

  private _reportTry(report: GausReport): Promise<void> {
    return superagent
      .post(`${this._serverUrl}${this._reportEndpoint(this._session.productGUID, this._session.deviceGUID)}`)
      .send(report)
      .set('Authorization', `Bearer ${this._session.token}`)
      .set('accept', 'json')
      .then();
  }

  protected _authenticate(deviceAuthParameters: GausDeviceAuthParameters): Promise<GausSession> {
    this._authAttempts++;

    const requestBody = { deviceAuthParameters };
    if (
      !requestBody ||
      !requestBody.deviceAuthParameters ||
      !requestBody.deviceAuthParameters.accessKey ||
      !requestBody.deviceAuthParameters.secretKey
    ) {
      return Promise.reject('In parameter(s) not defined');
    }

    if (this._authAttempts < this._MAX_NUMBER_OF_AUTH_RETRIES) {
      return superagent
        .post(`${this._serverUrl}${this._AUTHENTICATE_ENDPOINT}`)
        .send(requestBody)
        .set('accept', 'json')
        .then(result => {
          this._authAttempts = 0; // reseting attempts as auth succeeded
          this._session = result.body;
          return this._session;
        });
    } else {
      return Promise.reject('Authentication failed: Exeeded max number of auth retries');
    }
  }

  private _checkForUpdateEndpoint(productGUID: GausProductGUID, deviceGUID: GausDeviceGUID): string {
    return `/device/${productGUID}/${deviceGUID}/check-for-updates`;
  }
  private _reportEndpoint(productGUID: GausProductGUID, deviceGUID: GausDeviceGUID): string {
    return `/device/${productGUID}/${deviceGUID}/report`;
  }
}
