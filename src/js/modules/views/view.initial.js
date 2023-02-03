import View from './view';
import { $el } from '../utils/util.helpers';
import pubSub from '../utils/util.pubSub';

class Initial extends View {
  constructor() {
    super();
    this.parentEl = $el('.query-result');
    this.#handleLatestQueryClick();
    pubSub.subscribe('latestQueries', this.#renderInitialView);
  }

  #renderInitialView = queries => {
    const markup = !queries.length
      ? this.#renderDefaultMessage()
      : this.#renderLatestQueries(queries);
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  };

  #renderLatestQueries = queries => `
        <div class="latest-queries d-flex flex-column gap-4">
            <h1 class="latest-queries__title text-center">Your latest queries</h1>
            ${this.#generateQueriesList(queries)}
        </div>
    `;

  #renderDefaultMessage = () => `
      <div class="latest-queries d-flex flex-column gap-4">
        <h1 class="latest-queries__title text-center">Welcome to the Dictionary App</h1>
        <p class="text-center">
           Start by searching for your first word!
        </p>
      </div>  
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

  #handleLatestQueryClick = () => {
    this.parentEl.addEventListener('click', event => {
      const element = event.target.closest('[data-query]');
      if (!element) return;
      const { query } = element.dataset;
      pubSub.publish('userInput', query);
    });
  };
}

export default new Initial();
