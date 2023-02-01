import { VALIDATION_ERROR } from './error.config';

export default class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = VALIDATION_ERROR;
    this.feedback = 'Please make sure that the input field is not empty.';
  }
}
