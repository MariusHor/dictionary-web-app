/* eslint-disable default-param-last */
import pubSub from './utils/util.pubSub';
import { NetworkError } from './customErrors';
import { API_URL, TIMEOUT_SEC } from './utils/util.config';
import { timeout } from './utils/util.helpers';
import { LOAD_STATE, NEW_QUERY, SAVE_CURRENT_FONT } from './actions/actions';

class Model {
  #initialState = {
    currentFont: 'mono',
    queries: [],
  };

  #state = undefined;

  constructor() {
    this.persistedState = this.#loadStateFromStorage();
    pubSub.subscribe('saveFont', this.#saveCurrentFont);
  }

  #loadStateFromStorage = () => {
    try {
      const serializedState = localStorage.getItem('state');
      if (serializedState === null) {
        return undefined;
      }
      return JSON.parse(serializedState);
    } catch (err) {
      return undefined;
    }
  };

  #saveStateToStorage = state => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('state', serializedState);
    } catch (err) {
      // Ignore write errors.
    }
  };

  #reducer = (state = this.#initialState, action) => {
    switch (action.type) {
      case NEW_QUERY: {
        const filteredState = state.queries.filter(query => state.queries.indexOf(query) < 19);
        return {
          ...state,
          queries: [action.payload, ...filteredState],
        };
      }
      case SAVE_CURRENT_FONT:
        return {
          ...state,
          currentFont: action.payload,
        };
      case LOAD_STATE:
        return {
          ...(this.persistedState || state),
        };
      default:
        return state;
    }
  };

  #saveCurrentFont = action => {
    this.#state = this.#reducer(this.#state, action);
    this.#saveStateToStorage(this.#state);
    pubSub.publish('currentFont', this.#state.currentFont);
  };

  handleQuery = async action => {
    try {
      const fetchQuery = fetch(`${API_URL}${action.payload}`);
      const response = await Promise.race([fetchQuery, timeout(TIMEOUT_SEC)]);

      if (!response.ok) {
        throw new NetworkError(response, action.payload);
      }

      const data = await response.json();
      pubSub.publish('queryResult', data);

      if (this.#state.queries.includes(action.payload)) return;

      this.#state = this.#reducer(this.#state, action);
      this.#saveStateToStorage(this.#state);
    } catch (error) {
      throw error;
    }
  };

  getState = action => {
    this.#state = this.#reducer(this.#state, action);
    return this.#state;
  };
}

export default new Model();
