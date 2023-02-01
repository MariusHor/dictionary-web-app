import { TIMEOUT_ERROR } from './error.config';

export default class TimeoutError extends Error {
  constructor(message, seconds) {
    super(message);
    this.name = TIMEOUT_ERROR;
    this.feedback = `Request took too long! Timeout after ${seconds} seconds`;
  }
}
