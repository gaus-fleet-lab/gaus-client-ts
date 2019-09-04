import {
  GausClient,
  GausDeviceAuthParameters,
  RegisterResponse,
  CheckForUpdateResponse,
  ReportRequest,
} from '../gaus-client';

//   Test that runs regiester, authenticate, check-for-updates and report
//   against the static dev stack with below product credentials
describe('real data test', (): void => {
  it('that do register, authenticate, check-for-update and report flow', (done): void => {
    const client = new GausClient('https://static.dev.gaus.sonymobile.com');
    const productAuthParameters = {
      accessKey: '[FILL IN WITH PRODUCT ACCESS KEY]',
      secretKey: '[FILL IN WITH PRODUCT SECRET]',
    };
    const deviceId = 'test device 1';
    let deviceAuthParams: GausDeviceAuthParameters;
    const registerRequestParameters = { productAuthParameters, deviceId };

    client
      .register(registerRequestParameters)
      .then(
        (res: RegisterResponse | void): Promise<CheckForUpdateResponse | void> => {
          deviceAuthParams = res && res.deviceAuthParameters;
          return client.checkForUpdates(deviceAuthParams);
        }
      )
      .then(
        (res: CheckForUpdateResponse): void => {
          console.log('Updates found:');
          console.log(JSON.stringify(res.updates));
          return;
        }
      )
      .then(
        (): Promise<void> => {
          const timestring = new Date().toISOString();
          const report: ReportRequest = {
            data: [
              {
                v_ints: { aKey: 1 }, // eslint-disable-line @typescript-eslint/camelcase
                type: 'metric.generic.TestingTSClientEvent',
                ts: timestring,
              },
            ],
            header: {
              ts: timestring,
            },
            version: '1.0',
          };
          return client.report(deviceAuthParams, report);
        }
      )
      .then(done)
      .catch(
        (error: Error): void => {
          done.fail(error);
        }
      );
  });
});
