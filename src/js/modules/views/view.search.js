import View from './view';
import { $el, addListeners } from '../utils/util.helpers';
import pubSub from '../utils/util.pubSub';

class Search extends View {
  #invalidFeedback = $el('.invalid-feedback');

  input = $el('.form__input');

  constructor() {
    super();
    this.parentEl = $el('.form');
    this.#handleUserInput();
  }

  #showFeedback = () => {
    this.#invalidFeedback.classList.add('show');
    this.#invalidFeedback.classList.remove('hide');
    this.input.classList.add('invalid-input');
  };

  #hideFeedback = () => {
    this.#invalidFeedback.classList.remove('show');
    this.#invalidFeedback.classList.add('hide');
    this.input.classList.remove('invalid-input');
  };

  handleValidationError = error => {
    this.#showFeedback();
    this.#invalidFeedback.textContent = error.feedback;

    addListeners([{ element: this.input, events: ['keydown', 'blur'] }], () => {
      this.#hideFeedback();
    });
  };

  #handleUserInput = () => {
    this.parentEl.addEventListener('submit', event => {
      event.preventDefault();
      const { value } = this.input;
      pubSub.publish('userInput', value);
      this.focusInput();
    });
  };
}
export default new Search();
