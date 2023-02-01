import View from './view';
import { $el } from '../utils/util.helpers';
import pubSub from '../utils/util.pubSub';

class Search extends View {
  input = $el('.form__input');

  feedbackEl = $el('.invalid-feedback');

  constructor() {
    super();
    this.parentEl = $el('.form');
    this.#handleUserInput();
  }

  #handleUserInput() {
    this.parentEl.addEventListener('submit', event => {
      event.preventDefault();
      const { value } = this.input;
      pubSub.publish('userInput', value);
      this.focusInput();
    });
  }
}
export default new Search();
