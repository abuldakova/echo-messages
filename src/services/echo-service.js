'use strict';

import { default as services } from '../constants/di.js';

export class EchoService {
  constructor({ diContainer, config }) {
    this.messageStore = diContainer.resolve(services.MESSAGE_STORE);
    this.schedulerStep = config.scheduler_step;
  }

  async pollEchoData() {
    const data = await this.messageStore.getByTime();

    if (!data) {
      setTimeout(() => this.pollEchoData(), this.schedulerStep);
      return;
    }

    console.log('--- Message ---', data);
    await this.messageStore.remove(data);

    this.pollEchoData();
  }
}
