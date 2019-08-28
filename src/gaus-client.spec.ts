import { GausClient } from './gaus-client';

describe('GausClient', (): void => {
  it('instantiates', (): void => {
    const client = new GausClient();
    expect(client).toBeTruthy();
  });

  it('register fails with falsy in parameters', (done): void => {
    const client = new GausClient();
    try {
      client.register(null, '');
      done.fail(new Error('Should throw error'));
    } catch {
      done();
    }
  });

  it('register should return with correct in parameters ', (done): void => {
    const client = new GausClient();
    try {
      const registerResponse = client.register({ accessKey: 'fakeAK', secretKey: 'fakeSK' }, 'fakeDID');
      expect(registerResponse).toBeTruthy();
      done();
    } catch {
      done.fail(new Error('Should not throw error'));
    }
  });

  it('checkForUpdates fails with no valid session', (done): void => {
    const client = new GausClient();
    try {
      client.checkForUpdates(null);
      done.fail(new Error('Should throw error'));
    } catch {
      done();
    }
  });

  it('report fails with no valid session', (done): void => {
    const client = new GausClient();
    try {
      client.report(null, null);
      done.fail(new Error('Should throw error'));
    } catch {
      done();
    }
  });
});
