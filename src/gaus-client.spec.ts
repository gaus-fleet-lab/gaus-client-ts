import { GausClient } from './gaus-client';

describe('GausClient', () => {
  it('instantiates', () => {
    let client = new GausClient();
    expect(client).toBeTruthy();
  });
});
