import { $el, capitalize } from '../utils/util.helpers';
import View from './view';
import pubSub from '../utils/util.pubSub';
import { SAVE_CURRENT_FONT } from '../actions/actions';

class FontSwitch extends View {
  #fontClasses = ['ff-serif', 'ff-sans-serif', 'ff-mono'];

  #root = $el('#app');

  #dropdownBtn = $el('.dropdown-btn');

  constructor() {
    super();
    this.parentEl = $el('.dropdown');
    this.handleFontSwitchClick();
    pubSub.subscribe('currentFont', this.switchFont);
  }

  switchFont = font => {
    this.#fontClasses.forEach(fontClass => this.#root.classList.remove(fontClass));
    this.#root.classList.add(`ff-${font}`);
    this.#dropdownBtn.textContent = capitalize(font);
  };

  handleFontSwitchClick = () => {
    this.parentEl.addEventListener('click', event => {
      const currentEl = event.target.closest('[data-font]');
      if (!currentEl) return;
      const { font } = currentEl.dataset;
      pubSub.publish('saveFont', {
        type: SAVE_CURRENT_FONT,
        payload: font,
      });
    });
  };
}

export default new FontSwitch();
