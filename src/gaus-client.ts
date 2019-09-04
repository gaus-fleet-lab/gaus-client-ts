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
  version: string; // use update type lib?
  packageType: string;
  updateType: string;
  md5: string;
}

//Requests
export interface RegisterRequest {
  productAuthParameters: GausProductAuthParameters;
  deviceId: UserDeviceId;
}

export interface AuthenticateRequest {
  deviceAuthParameters: GausDeviceAuthParameters;
}
export interface ReportRequest {
  data: GausReportData[];
  header: GausReportHeader;
  version: GausReportVersion;
}

//Responses
export interface RegisterResponse {
  pollInterval: number;
  deviceAuthParameters: GausDeviceAuthParameters;
}

export interface AuthenticationResponse {
  deviceGUID: string;
  productGUID: string;
  token: string;
}

export interface CheckForUpdateResponse {
  updates: GausUpdate[];
}

export class GausClient {
  private _serverUrl: string;
  private _session: GausSession = {
    deviceGUID: 'Not authenticated',
    productGUID: 'Not authenticated',
    token: 'Not authenticated',
  };

  private _REGISTER_ENDPOINT = '/register';
  private _AUTHENTICATE_ENDPOINT = '/authenticate';

  private _MAX_NUMBER_OF_AUTH_RETRIES = 3;
  private _authAtempts = 0;

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
    return requestPromise(reqOpt).promise();
  }

  checkForUpdates(deviceAuthParameters: GausDeviceAuthParameters): Promise<CheckForUpdateResponse | void> {
    return this._checkForUpdateTry().catch(
      (error: any): Promise<CheckForUpdateResponse | void> => {
        if (error.statusCode && (error.statusCode === 401 || error.statusCode === 403)) {
          this._session = null;
          return this._authenticate({ deviceAuthParameters }).then(
            (): Promise<CheckForUpdateResponse> => this._checkForUpdateTry()
          );
        } else {
          return Promise.reject(error);
        }
      }
    );
  }

  report(deviceAuthParameters: GausDeviceAuthParameters, reportRequest: ReportRequest): Promise<void> {
    if (!reportRequest || !reportRequest.data || !reportRequest.header || !reportRequest.version) {
      return Promise.reject('In parameter(s) not defined');
    }

    return this._reportTry(reportRequest).catch(
      (error: any): Promise<void> => {
        if (error.statusCode && (error.statusCode === 401 || error.statusCode === 403)) {
          this._session = null;
          return this._authenticate({ deviceAuthParameters }).then((): Promise<void> => this._reportTry(reportRequest));
        } else {
          return Promise.reject(error);
        }
      }
    );
  }

  private _checkForUpdateTry(): Promise<CheckForUpdateResponse> {
    const reqOpt = {
      uri: `${this._serverUrl}${this._checkForUpdateEndpoint(this._session.productGUID, this._session.deviceGUID)}`,
      headers: {
        Authorization: `Bearer ${this._session.token}`,
      },
      json: true,
    };
    return requestPromise(reqOpt).promise();
  }

  private _reportTry(reportRequest: ReportRequest): Promise<void> {
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

  private _authenticate(authenticationRequest: AuthenticateRequest): Promise<GausSession | void> {
    this._authAtempts++;
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
    if (this._authAtempts < this._MAX_NUMBER_OF_AUTH_RETRIES) {
      return requestPromise(reqOpt).then(
        (authenticateResponse: AuthenticationResponse): GausSession => {
          this._authAtempts = 0; // reseting atempts as auth succeeded
          this._session = authenticateResponse;
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
