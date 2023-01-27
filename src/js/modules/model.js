import pubSub from './utils/util.pubSub';
import { NetworkError } from './customErrors';
import { API_URL } from './utils/util.config';

class Model {
  constructor() {
    this.queries = [];
  }

  async handleQuery(query) {
    this.queries.push(query);
    try {
      const response = await fetch(`${API_URL}${query}`);

      if (!response.ok) {
        throw new NetworkError(response, query);
      }
      const data = await response.json();
      pubSub.publish('queryResult', data);
    } catch (error) {
      throw error;
    }
  }
}

export default new Model();
