import * as requestPromise from 'request-promise';

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
    const reqeustBody = { productAuthParameters, deviceId };
    if (
      !reqeustBody.productAuthParameters ||
      !reqeustBody.productAuthParameters.accessKey ||
      !reqeustBody.productAuthParameters.secretKey ||
      !reqeustBody.deviceId
    ) {
      return Promise.reject('In parameter(s) not defined');
    }

    const reqOpt = {
      uri: `${this._serverUrl}${this._REGISTER_ENDPOINT}`,
      method: 'POST',
      body: reqeustBody,
      json: true,
    };
    return requestPromise(reqOpt).promise();
  }

  checkForUpdates(deviceAuthParameters: GausDeviceAuthParameters): Promise<GausUpdate[]> {
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
          this._checkForUpdateTry().catch(
            (error: any): Promise<GausUpdate[]> => {
              if (error.statusCode && (error.statusCode === 401 || error.statusCode === 403)) {
                this._session = null;
                return this._authenticate(deviceAuthParameters).then(
                  (): Promise<GausUpdate[]> => this._checkForUpdateTry()
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

  private _checkForUpdateTry(): Promise<GausUpdate[]> {
    const reqOpt = {
      uri: `${this._serverUrl}${this._checkForUpdateEndpoint(this._session.productGUID, this._session.deviceGUID)}`,
      headers: {
        Authorization: `Bearer ${this._session.token}`,
      },
      json: true,
    };
    return requestPromise(reqOpt).promise();
  }

  private _reportTry(report: GausReport): Promise<void> {
    const reqOpt = {
      uri: `${this._serverUrl}${this._reportEndpoint(this._session.productGUID, this._session.deviceGUID)}`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this._session.token}`,
      },
      body: report,
      json: true,
    };
    return requestPromise(reqOpt).promise();
  }

  private _authenticate(deviceAuthParameters: GausDeviceAuthParameters): Promise<GausSession> {
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

    const reqOpt = {
      uri: `${this._serverUrl}${this._AUTHENTICATE_ENDPOINT}`,
      method: 'POST',
      body: requestBody,
      json: true,
    };
    if (this._authAttempts < this._MAX_NUMBER_OF_AUTH_RETRIES) {
      return requestPromise(reqOpt).then(
        (session: GausSession): GausSession => {
          this._authAttempts = 0; // reseting attempts as auth succeeded
          this._session = session;
          return this._session;
        }
      );
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
