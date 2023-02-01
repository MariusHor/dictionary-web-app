import { NETWORK_ERROR } from './error.config';

export default class NetworkError extends Error {
  constructor(response, query) {
    super(response.statusText);
    this.name = NETWORK_ERROR;
    this.status = response.status;
    this.response = response;
    this.query = query;
  }
}
