import { GausClient } from './gaus-client';

describe('GausClient', (): void => {
  const FAKE_SERVER = 'fakeServer';

  it('instantiates', (): void => {
    const client = new GausClient(FAKE_SERVER);
    expect(client).toBeTruthy();
  });

  it('register fails with falsy in parameters', (done): void => {
    new GausClient(FAKE_SERVER)
      .register(null, '')
      .then(() => {
        done.fail(new Error('Should throw error'));
      })
      .catch(() => {
        done();
      });
  });

  // it('register should return with correct in parameters ', (done): void => {
  //   new GausClient(FAKE_SERVER)
  //     .register({ accessKey: 'fakeAK', secretKey: 'fakeSK' }, 'fakeDID')
  //     .then(registerResponse => {
  //       expect(registerResponse).toBeTruthy();
  //       done();
  //     })
  //     .catch(() => {
  //       done.fail(new Error('Should not throw error'));
  //     });
  // });

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

  it('report fails with no valid session', (done): void => {
    const client = new GausClient(FAKE_SERVER);
    client
      .report(null, null)
      .then(() => {
        done.fail('Should throw error and not get here');
      })
      .catch(
        (): void => {
          done();
        }
      );
  });

  // Test that runs regiester, authenticate, check-for-updates and report
  // against the static dev stack with below product credentials
  //
  // fit('real data test', (done): void => {
  //   const client = new GausClient('https://static.dev.gaus.sonymobile.com');
  //   const productKeys = {
  //     accessKey: 'ef867abf-b9b8-4b77-b71f-9e6bd542e7b0',
  //     secretKey: 'f0b6f8f5bec68c31aae8b2e8957dad8fbdf04c13d8daa43889d8152ca435d2c8',
  //   };
  //   const deviceId = 'test device 1';
  //   let deviceAuthParams: GausDeviceAuthParameters;

  //   client
  //     .register(productKeys, deviceId)
  //     .then(
  //       (
  //         res: { pollInterval: number; deviceAuthParameters: GausDeviceAuthParameters } | void
  //       ): Promise<GausUpdate[] | void> => {
  //         deviceAuthParams = res ? res.deviceAuthParameters : null;
  //         return client.checkForUpdates(deviceAuthParams);
  //       }
  //     )
  //     .then(
  //       (updates: GausUpdate[]): void => {
  //         console.log(updates);
  //         return;
  //       }
  //     )
  //     .then(
  //       (): Promise<void> => {
  //         const timestring = new Date().toISOString();
  //         const report: GausReport = {
  //           data: [
  //             {
  //               v_ints: { aKey: 1 },
  //               type: 'metric.generic.TestingTSClientEvent',
  //               ts: timestring,
  //             },
  //           ],
  //           header: {
  //             ts: timestring,
  //           },
  //           version: '1.0',
  //         };
  //         return client.report(deviceAuthParams, report);
  //       }
  //     )
  //     .then(
  //       (): void => {
  //         done();
  //       }
  //     )
  //     .catch(
  //       (error: Error): void => {
  //         console.error(error);
  //         done.fail();
  //       }
  //     );
  // });
});
