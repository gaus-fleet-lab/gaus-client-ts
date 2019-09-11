import * as superagent from 'superagent';
import { GausClient, GausReport } from './gaus-client';
const superagentMock = require('superagent-mocker')(superagent);

describe('GausClient', (): void => {
  const FAKE_SERVER = 'fakeServer';
  const FAKE_PRODUCT_AUTH_PARAMS = { accessKey: 'fakePAK', secretKey: 'fakePSK' };
  const FAKE_DEVICE_AUTH_PARAMS = { accessKey: 'fakeDAK', secretKey: 'fakeDSK' };
  const FAKE_POLL_INTERVAL = 10000;
  const FAKE_DEVICE_ID = 'fakeDID';
  const FAKE_UPDATE_TYPES = [{ name: 'fakeParamName', value: 'fakeParamValue' }];
  const FAKE_DEVICE_GUID = 'fakeDGUID';
  const FAKE_PRODUCT_GUID = 'fakePGUID';
  const FAKE_TOKEN = 'fakeToken';
  const FAKE_REPORT: GausReport = { data: [], header: { ts: 'fakeTime' }, version: 'fakeVersion' };

  const postSpy = jest.spyOn(superagent, 'post');
  const getSpy = jest.spyOn(superagent, 'get');

  beforeEach((): void => {
    superagentMock.clearRoutes();

    // Post request mocks
    superagentMock.post(
      `${FAKE_SERVER}/register`,
      (): any => ({ body: { pollInterval: FAKE_POLL_INTERVAL, deviceAuthParameters: FAKE_DEVICE_AUTH_PARAMS } })
    );
    superagentMock.post(
      `${FAKE_SERVER}/authenticate`,
      (): any => ({
        body: {
          deviceGUID: FAKE_DEVICE_GUID,
          productGUID: FAKE_PRODUCT_GUID,
          token: FAKE_TOKEN,
        },
      })
    );
    superagentMock.post(`${FAKE_SERVER}/device/${FAKE_PRODUCT_GUID}/${FAKE_DEVICE_GUID}/report`, (): void => {});

    // Get request mock
    superagentMock.get(
      `${FAKE_SERVER}/device/${FAKE_PRODUCT_GUID}/${FAKE_DEVICE_GUID}/check-for-updates`,
      (): any => ({ body: { updates: {} } })
    );

    superagent
      .get('')
      .query({})
      .set({})
      .end((): void => {});
    superagent
      .post('')
      .send()
      .end((): void => {});

    postSpy.mockClear();
    getSpy.mockClear();
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
      .register(FAKE_PRODUCT_AUTH_PARAMS, FAKE_DEVICE_ID)
      .then(
        (registerResponse): void => {
          expect(registerResponse).toBeTruthy();
          expect(postSpy).toHaveBeenCalledTimes(1);
          expect(postSpy).toHaveBeenCalledWith(`${FAKE_SERVER}/register`);
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
    new GausClient(FAKE_SERVER)
      .checkForUpdates(null, null)
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
    new GausClient(FAKE_SERVER)
      .checkForUpdates(FAKE_DEVICE_AUTH_PARAMS, FAKE_UPDATE_TYPES)
      .then(
        (fakeUpdates): void => {
          expect(fakeUpdates).toBeTruthy();
          expect(postSpy).toHaveBeenCalledTimes(1);
          expect(postSpy).toHaveBeenCalledWith(`${FAKE_SERVER}/authenticate`);
          expect(getSpy).toHaveBeenCalledTimes(1);
          expect(getSpy).toHaveBeenCalledWith(
            `${FAKE_SERVER}/device/${FAKE_PRODUCT_GUID}/${FAKE_DEVICE_GUID}/check-for-updates`
          );

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
    new GausClient(FAKE_SERVER)
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
    new GausClient(FAKE_SERVER)
      .report(FAKE_DEVICE_AUTH_PARAMS, FAKE_REPORT)
      .then(
        (): void => {
          expect(postSpy).toHaveBeenCalledTimes(2);
          expect(postSpy).toHaveBeenNthCalledWith(1, `${FAKE_SERVER}/authenticate`);
          expect(postSpy).toHaveBeenNthCalledWith(
            2,
            `${FAKE_SERVER}/device/${FAKE_PRODUCT_GUID}/${FAKE_DEVICE_GUID}/report`
          );
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
