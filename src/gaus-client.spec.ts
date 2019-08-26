import { GausClient } from './gaus-client';

describe('GausClient', (): void => {
  it('instantiates', (): void => {
    const client = new GausClient();
    expect(client).toBeTruthy();
  });
});
