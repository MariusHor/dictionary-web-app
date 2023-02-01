/* eslint-disable default-param-last */
import pubSub from './utils/util.pubSub';
import { NetworkError } from './customErrors';
import { API_URL, TIMEOUT_SEC } from './utils/util.config';
import { timeout } from './utils/util.helpers';

class Model {
  constructor() {
    this.persistedState = this.loadState();
    this.state = this.persistedState || {
      queries: [],
    };
  }

  #queriesReducer(
    state = {
      queries: [],
    },
    query,
  ) {
    if (!this.state?.queries.includes(query)) {
      return {
        ...state,
        queries: [query, ...state.queries],
      };
    }
    return state;
  }

  handleQuery = async query => {
    try {
      const fetchWord = fetch(`${API_URL}${query}`);
      const response = await Promise.race([fetchWord, timeout(TIMEOUT_SEC)]);

      if (!response.ok) {
        throw new NetworkError(response, query);
      }
      const data = await response.json();
      pubSub.publish('queryResult', data);
      this.state = this.#queriesReducer(this.state, query);
      this.saveState(this.state);
    } catch (error) {
      throw error;
    }
  };

  getState = () => this.state;

  loadState = () => {
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

  saveState = state => {
    try {
      const queries = state.queries.filter(query => state.queries.indexOf(query) < 10);
      const filteredState = {
        ...state,
        queries,
      };
      const serializedState = JSON.stringify(filteredState);
      localStorage.setItem('state', serializedState);
    } catch (err) {
      // Ignore write errors.
    }
  };
}

export default new Model();
