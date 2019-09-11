import { GausClient, GausDeviceAuthParameters, GausDeviceConfiguration, GausUpdate } from '../gaus-client';

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

    client
      .register(productAuthParameters, deviceId)
      .then(
        (res: GausDeviceConfiguration): Promise<GausUpdate[]> => {
          deviceAuthParams = res && res.deviceAuthParameters;
          const updateTypeFilter = [{ name: 'firmware-version', value: '0.0.0' }];
          return client.checkForUpdates(deviceAuthParams, updateTypeFilter);
        }
      )
      .then(
        (res: GausUpdate[]): void => {
          console.log('Updates found:', JSON.stringify(res));
          return;
        }
      )
      .then(
        (): Promise<void> => {
          const timestring = new Date().toISOString();
          const report = {
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
      .then(
        (): void => {
          done();
        }
      )
      .catch(
        (err): void => {
          done.fail(err);
        }
      );
  });
});
