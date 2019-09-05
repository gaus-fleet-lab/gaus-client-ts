import * as requestPromise from 'request-promise';
import { GausClient, GausReport } from './gaus-client';
jest.mock('request-promise');

describe('GausClient', (): void => {
  const FAKE_SERVER = 'fakeServer';
  const FAKE_DEVICE_AUTH_PARAMS = { accessKey: 'fakeAK', secretKey: 'fakeSK' };
  const FAKE_DEVICE_ID = 'fakeDID';
  const FAKE_REPORT: GausReport = { data: [], header: { ts: 'fakeTime' }, version: 'fakeVersion' };

  const EXPECTED_REGISTER_REQUEST = {
    body: { deviceId: FAKE_DEVICE_ID, productAuthParameters: FAKE_DEVICE_AUTH_PARAMS },
    json: true,
    method: 'POST',
    uri: `${FAKE_SERVER}/register`,
  };

  const EXPECTED_CHECKFORUPDATE_REQUEST = {
    headers: { Authorization: 'Bearer undefined' },
    json: true,
    uri: `${FAKE_SERVER}/device/undefined/undefined/check-for-updates`,
  };

  const EXPECTED_REPORT_REQUEST = {
    body: FAKE_REPORT,
    headers: { Authorization: 'Bearer undefined' },
    json: true,
    method: 'POST',
    uri: `${FAKE_SERVER}/device/undefined/undefined/report`,
  };

  beforeEach((): void => {
    jest.clearAllMocks();
    (requestPromise as any).mockImplementation(
      (req: any): any => {
        if (req.uri.includes('Not authenticated')) {
          return {
            promise: (): Promise<{}> => Promise.reject({ statusCode: 401 }),
          };
        } else if (req.uri.includes('authenticate')) {
          return Promise.resolve({});
        } else {
          return {
            promise: (): Promise<{}> => Promise.resolve({}),
          };
        }
      }
    );
  });

  it('instantiates', (): void => {
    const client = new GausClient(FAKE_SERVER);
    expect(client).toBeTruthy();
  });

  it('register fails with falsy in parameters', (done): void => {
    new GausClient(FAKE_SERVER)
      .register(null, '')
      .then(
        (): void => {
          done.fail(new Error('Should throw error with falsy in params'));
        }
      )
      .catch(
        (): void => {
          done();
        }
      );
  });

  it('register should return with correct in parameters ', (done): void => {
    new GausClient(FAKE_SERVER)
      .register(FAKE_DEVICE_AUTH_PARAMS, 'fakeDID')
      .then(
        (registerResponse): void => {
          expect(registerResponse).toBeTruthy();
          expect(requestPromise).toHaveBeenCalledTimes(1); // register
          expect(requestPromise).toHaveBeenCalledWith(EXPECTED_REGISTER_REQUEST);

          done();
        }
      )
      .catch(
        (error: Error): void => {
          done.fail(error);
        }
      );
  });

  it('checkForUpdates should fail with falsy in parameters', (done): void => {
    const client = new GausClient(FAKE_SERVER);
    client
      .checkForUpdates(null)
      .then(
        (): void => {
          done.fail('Should throw error when falsy in parameters');
        }
      )
      .catch(
        (): void => {
          done();
        }
      );
  });

  it('checkForUpdates should return with correct in parameters', (done): void => {
    const client = new GausClient(FAKE_SERVER);
    client
      .checkForUpdates(FAKE_DEVICE_AUTH_PARAMS)
      .then(
        (fakeUpdates): void => {
          expect(fakeUpdates).toBeTruthy();
          expect(requestPromise).toHaveBeenCalledTimes(2); // authenticate + check-for-update
          expect(requestPromise).toHaveBeenNthCalledWith(2, EXPECTED_CHECKFORUPDATE_REQUEST);
          done();
        }
      )
      .catch(
        (error): void => {
          done.fail(error);
        }
      );
  });

  it('report fails with no valid session', (done): void => {
    const client = new GausClient(FAKE_SERVER);
    client
      .report(null, null)
      .then(
        (): void => {
          done.fail('Should throw error when falsy in parameters');
        }
      )
      .catch(
        (): void => {
          done();
        }
      );
  });

  it('report should return with correct in parameters', (done): void => {
    const client = new GausClient(FAKE_SERVER);

    client
      .report(FAKE_DEVICE_AUTH_PARAMS, FAKE_REPORT)
      .then(
        (): void => {
          expect(requestPromise).toHaveBeenCalledTimes(2); // authenticate + report
          expect(requestPromise).toHaveBeenNthCalledWith(2, EXPECTED_REPORT_REQUEST);
          done();
        }
      )
      .catch(
        (error): void => {
          done.fail(error);
        }
      );
  });
});
