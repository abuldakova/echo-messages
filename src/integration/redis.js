'use strict';

import Redis from 'ioredis';

export class RedisClient {
  constructor({ host, port }) {
    this.client = new Redis(port, host);
    this.key = `echoMessages:list`;
  }

  async add({ score, data }) {
    this.client.zadd(this.key, score, data);
  }

  getItems({ max, options }) {
    return this.client.zrange(this.key, 0, +max, ...options);
  }

  getItemsWithScore(max) {
    return this.getItems({ max, options: [ 'withscores' ] });
  }

  async getLastItemByScore(max) {
    const result = await this.getItems({ max, options: [ 'byscore', 'limit', 0, 1 ] });
    return result[0];
  }

  remove(data) {
    return this.client.zrem(this.key, data);
  }
}
