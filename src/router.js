'use strict';

import express from 'express';

import { MessageController } from './controllers/message-controller.js';

export class Router {
  init({ diContainer }) {
    const router = express.Router();
    const messageController = new MessageController({ diContainer });

    router.post('/echoMessageAtTime', messageController.addMessageToList.bind(messageController));
    router.get('/scheduledMessages', messageController.showMessagesList.bind(messageController));

    return router;
  }
}