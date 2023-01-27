export default class NetworkError extends Error {
  constructor(response, query) {
    super(response.statusText);
    this.name = 'HTTP Error';
    this.status = response.status;
    this.response = response;
    this.query = query;
  }
}
