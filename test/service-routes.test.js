import request from 'supertest';
import express from 'express';

import { Router } from '../src/router.js';
import { DIContainer } from '../src/utils/di.js';
import { default as services } from '../src/constants/di.js';
import { MessageStore } from '../src/services/message-store.js';

import { RedisClient } from '../src/integration/redis.js';
import sinon from 'sinon';

import { jest } from '@jest/globals';
jest.useFakeTimers();

describe('check service routes', function () {
  const app = express();
  app.use(express.json());
  const router = new Router({ config: {} });
  const diContainer = new DIContainer();
  const msg = {
    message: 'message1',
    time: 1654000043,
  };
  const getItemsStub = sinon.stub(RedisClient.prototype, 'getItemsWithScore');
  const postItemStub = sinon.stub(RedisClient.prototype, 'add');

  const redisClient = new RedisClient({});
  diContainer.register(services.MESSAGE_STORE, new MessageStore({ redisClient }));
  app.use('/', router.init({ diContainer }));

  describe('/scheduledMessages', function () {
    test('empty list', async () => {
      getItemsStub.onCall(0).returns([]);

      const res = await request(app).get('/scheduledMessages');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ messages: [] });
    });

    test('list with 2 messages', async () => {
      getItemsStub.onCall(1).returns([...Object.values(msg)]);

      const res = await request(app).get('/scheduledMessages');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        messages: [ msg ],
      });
    });
  });

  describe('/echoMessageAtTime', function () {
    test('successfully added message', async () => {
      const res = await request(app)
        .post('/echoMessageAtTime')
        .send(msg)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: `Message ${msg.message} scheduled to ${msg.time}`,
      });
    });

    test('validaion failed', async () => {
      const res = await request(app)
        .post('/echoMessageAtTime')
        .send({
          ...msg,
          time: 'invalid'
        })
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: `Failed payload validation: \"time\" must be in timestamp or number of milliseconds format`,
      });
    });

    test('redis failed', async () => {
      postItemStub.onCall(1).throws(new Error('Redis failed'));

      const res = await request(app)
        .post('/echoMessageAtTime')
        .send(msg)
        .set('Accept', 'application/json');

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        message: 'Redis failed',
      });
    });

  });

});