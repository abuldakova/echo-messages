'use strict';

export class MessageStore {
  constructor({ redisClient }) {
    this.store = redisClient;
  }

  add({ msg, time }) {
    this.store.add({ score: time, data: msg });
  }

  async listAll() {
    const list = await this.store.getItemsWithScore(Math.floor(+new Date() / 1000));
    return list.reduce((acc, item, ind) => {
      if (ind % 2 == 0) {
        acc.push({ message: item });
      } else {
        acc[acc.length-1].time = item;
      }
      return acc;
    }, []);
  }

  getByTime() {
    return this.store.getLastItemByScore(Math.floor(+new Date() / 1000));
  }

  remove(data) {
    return this.store.remove(data);
  }
}
