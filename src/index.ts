export { GausClient } from './gaus-client';

//Exported types:
//Device
export {
  UserDeviceId,
  GausDeviceGUID,
  GausDeviceAccessKey,
  GausDeviceSecretKey,
  GausDeviceAuthParameters,
} from './gaus-client';

//Product
export { GausProductGUID, GausProductAccessKey, GausProductSecretKey, GausProductAuthParameters } from './gaus-client';

//Report
export { GausReportVersion, DateString, GausReportData, GausReportHeader } from './gaus-client';

//Session
export { GausToken, GausSession } from './gaus-client';

//Update
export { GausUpdateGUID, GausMetadata, GausUpdate } from './gaus-client';

//Requests
export { RegisterRequest, AuthenticateRequest, ReportRequest } from './gaus-client';

//Responses
export { RegisterResponse, AuthenticationResponse, CheckForUpdateResponse } from './gaus-client';
