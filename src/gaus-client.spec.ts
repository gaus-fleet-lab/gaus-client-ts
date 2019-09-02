import * as requestPromise from 'request-promise';
import { GausClient } from './gaus-client';
jest.mock('request-promise');

describe('GausClient', (): void => {
  const FAKE_SERVER = 'fakeServer';
  const FAKE_DEVICE_AUTH_PARAMS = { accessKey: 'fakeAK', secretKey: 'fakeSK' };

  beforeEach((): void => {
    (requestPromise as any).mockClear();
    (requestPromise as any).mockImplementation(
      (req: any): any => {
        if (req.uri.includes('authenticate')) {
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
      .register({ productAuthParameters: null, deviceId: '' })
      .then(
        (): void => {
          done.fail(new Error('Should throw error'));
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
      .register({ productAuthParameters: FAKE_DEVICE_AUTH_PARAMS, deviceId: 'fakeDID' })
      .then(
        (registerResponse: RegisterResponse): void => {
          expect(registerResponse).toBeTruthy();
          expect(requestPromise).toHaveBeenCalledTimes(1); // register
          done();
        }
      )
      .catch(
        (): void => {
          done.fail('Should not throw error');
        }
      );
  });

  it('checkForUpdates fails with no valid session', (done): void => {
    const client = new GausClient(FAKE_SERVER);
    client
      .checkForUpdates(null)
      .then(
        (): void => {
          done.fail('Should throw error and not get here');
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
          done();
        }
      )
      .catch(
        (): void => {
          done.fail('Should not throw error');
        }
      );
  });

  it('report fails with no valid session', (done): void => {
    const client = new GausClient(FAKE_SERVER);
    client
      .report(null, null)
      .then(
        (): void => {
          done.fail('Should throw error and not get here');
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
    const fakeReport: ReportRequest = { data: [], header: { ts: 'fakeTime' }, version: 'fakeVersion' };
    client
      .report(FAKE_DEVICE_AUTH_PARAMS, fakeReport)
      .then(
        (): void => {
          expect(requestPromise).toHaveBeenCalledTimes(2); // authenticate + report
          done();
        }
      )
      .catch(
        (): void => {
          done.fail('Should not throw error');
        }
      );
  });
});
