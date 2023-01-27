export default class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Validation Error';
    this.feedback = 'Please make sure that the input field is not empty.';
  }
}
