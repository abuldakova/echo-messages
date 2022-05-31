'use strict';

import { default as schema } from './schemas/schedule-message.js';
import { default as services } from '../constants/di.js';
import { PayloadValidator } from '../utils/payload-validator.js';
import { BaseController } from './base-controller.js';

export class MessageController extends BaseController {
  constructor({ diContainer }) {
    super();
    this.messageStore = diContainer.resolve(services.MESSAGE_STORE);
  }

  async addMessageToList(req, res) {
    try {
      const { body: data } = req;
      PayloadValidator.validate({ schema, data });

      const { message: msg, time } = data;
      await this.messageStore.add({ msg, time });
      
      return this.sendOkResponse({ res, data: { message: `Message ${msg} scheduled to ${time}` } });
    } catch (error) {
      return this.sendErrorResponse({ error, res });
    }
  }

  async showMessagesList(req, res) {
    try {
      const list = await this.messageStore.listAll();
      
      return this.sendOkResponse({ res, data: { messages: list } });
    } catch (error) {
      return this.sendErrorResponse({ error, res });
    }
  }
}
