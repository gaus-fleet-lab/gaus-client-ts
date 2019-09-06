import { GausClient, GausDeviceAuthParameters, GausDeviceConfiguration, GausUpdate } from '../gaus-client';

//   Test that runs regiester, authenticate, check-for-updates and report
//   against the static dev stack with below product credentials
describe('real data test', (): void => {
  it('that do register, authenticate, check-for-update and report flow', (done): void => {
    const client = new GausClient('https://static.dev.gaus.sonymobile.com');
    const productAuthParameters = {
      accessKey: '5118b598-e6c4-44ad-bf62-c0a816f13ee0',
      secretKey: 'f16bb8e586cc57b241abdabedcd393a89e7afbf4f24e3500bfa1b84f27bbb0b9',
    };
    const deviceId = 'test device 1';
    let deviceAuthParams: GausDeviceAuthParameters;

    client
      .register(productAuthParameters, deviceId)
      .then(
        (res: GausDeviceConfiguration): Promise<GausUpdate[]> => {
          deviceAuthParams = res && res.deviceAuthParameters;
          return client.checkForUpdates(deviceAuthParams);
        }
      )
      .then(
        (res: GausUpdate[]): void => {
          console.log('Updates found:');
          console.log(JSON.stringify(res));
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
