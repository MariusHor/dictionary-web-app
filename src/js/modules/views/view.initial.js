import View from './view';
import { $el } from '../utils/util.helpers';
import pubSub from '../utils/util.pubSub';

class Initial extends View {
  constructor() {
    super();
    this.parentEl = $el('.query-result');
    this.#handleLatestQueryClick();
    pubSub.subscribe('queries', this.#renderLatestQueries);
  }

  #renderLatestQueries = queries => {
    const queryMarkup = `
        <div class="latest-queries d-flex flex-column gap-4">
            <h1 class="latest-queries__title text-center">Your latest queries</h1>
            ${!queries.length ? this.#generateDefaultMessage() : this.#generateQueriesList(queries)}
        </div>
    `;
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', queryMarkup);
  };

  #generateDefaultMessage = () => `
        <p>
            Start by searching for your first word!
        </p>
    `;

  #generateQueriesList = queries => `
    <div class="latest-queries__buttons d-flex justify-content-center flex-wrap gap-4">
        ${queries
          .map(
            query => `
                <button class="btn btn-purple btn-sm" data-query="${query}">${query}</button>
            `,
          )
          .join('')}
    </div>`;

  #handleLatestQueryClick() {
    this.parentEl.addEventListener('click', event => {
      const element = event.target.closest('[data-query]');
      if (!element) return;
      const { query } = element.dataset;
      pubSub.publish('userInput', query);
    });
  }
}

export default new Initial();
