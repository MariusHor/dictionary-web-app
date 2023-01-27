import View from './view';
import { $el } from '../utils/util.helpers';
import pubSub from '../utils/util.pubSub';

class SearchView extends View {
  formInput = $el('.form__input');

  feedbackEl = $el('.invalid-feedback');

  constructor() {
    super();
    this.parentEl = $el('.form');
    pubSub.subscribe('validationError', this.handleValidationError);
    this.handleUserInput();
  }

  handleUserInput() {
    this.parentEl.addEventListener('submit', event => {
      event.preventDefault();
      const query = this.formInput.value;
      pubSub.publish('userInput', query);
    });
  }
}
export default new SearchView();
