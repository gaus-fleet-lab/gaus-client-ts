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

  it('authenticate fails with falsy in parameters', (done): void => {
    const client = new GausClient();
    try {
      client.authenticate(null);
      done.fail(new Error('Should throw error'));
    } catch {
      done();
    }
  });

  it('authenticate should not throw exception with correct in parameters ', (done): void => {
    const client = new GausClient();
    try {
      client.authenticate({ accessKey: 'fakeAK', secretKey: 'fakeSK' });
      done();
    } catch {
      done.fail(new Error('Should not throw error'));
    }
  });

  it('checkForUpdates fails with no valid session', (done): void => {
    const client = new GausClient();
    try {
      client.checkForUpdates();
      done.fail(new Error('Should throw error'));
    } catch {
      done();
    }
  });

  it('report fails with no valid in parameters', (done): void => {
    const client = new GausClient();
    try {
      client.report('', '', null);
      done.fail(new Error('Should throw error'));
    } catch {
      done();
    }
  });
});
