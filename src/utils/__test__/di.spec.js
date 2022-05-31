'use strict';

import { DIContainer } from '../di.js';

describe('Dependency container (DI)', () => {
  const container = new DIContainer();

  test('(1) should able resolve an service if the service was registered', () => {
    const service = 'some value';
    container.register('some', service);

    const resolvedSrvice = container.resolve('some');
    expect(resolvedSrvice).toEqual(service);
  });
});
