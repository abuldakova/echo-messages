'use strict';

import express from 'express';

import { default as config } from './config.js';
import { default as services } from './constants/di.js';
import { Router } from './router.js';
import { DIContainer } from './utils/di.js';
import { MessageStore } from './services/message-store.js';
import { EchoService } from './services/echo-service.js';
import { RedisClient } from './integration/redis.js';

const { port, redis: redisConfig, echo: echoConfig } = config;

const diContainer = new DIContainer();
const router = new Router({ config });

const redisClient = new RedisClient(redisConfig);
diContainer.register(services.MESSAGE_STORE, new MessageStore({ redisClient }));

const app = express();
app.disable('x-powered-by')
  .use(express.json())
  .use('/', router.init({ diContainer }))
  .listen(port, () => {
    console.log(`App listening on port ${port}`)
  });

const echoService = new EchoService({ diContainer, config: echoConfig });
echoService.pollEchoData();