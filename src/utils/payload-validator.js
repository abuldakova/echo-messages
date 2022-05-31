'use strict';

export class PayloadValidator {

  static validate({ schema, data }) {
    const result = schema.validate(data, { abortEarly: false, allowUnknown: false });
    if (result.error == null) return;

    const {
      error: { details },
    } = result;
    const message = details.map((i) => i.message).join(',');

    throw new Error(`Failed payload validation: ${message}`);
  }
}
