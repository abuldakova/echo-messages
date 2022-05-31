'use strict';

import Joi from 'joi';

export default Joi.object({
  message: Joi.string().trim().required(),
  time: Joi.date().timestamp().required(),
});
