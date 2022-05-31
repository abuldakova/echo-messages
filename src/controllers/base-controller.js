'use strict';

export class BaseController {
  sendErrorResponse({
    status = 400,
    error: { message = 'Server error' },
    res,
  }) {
    return res.status(status).send({ message });
  }

  sendOkResponse({ res, data, status = 200, }) {
    return res.status(status).send(data);
  }
}
