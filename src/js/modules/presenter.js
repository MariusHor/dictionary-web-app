import { formatInput, getFormattedDate } from './utils/util.helpers';
import pubSub from './utils/util.pubSub';
import { ValidationError } from './customErrors';
import { NETWORK_ERROR, TIMEOUT_ERROR, VALIDATION_ERROR } from './customErrors/error.config';
import { LOAD_STATE, NEW_QUERY } from './actions/actions';

export default class Presenter {
  constructor(views, model) {
    this.views = views;
    this.model = model;
  }

  #errorHandler = error => {
    switch (error.name) {
      case NETWORK_ERROR:
        this.views.results.renderNetworkError(error);
        break;
      case TIMEOUT_ERROR:
        this.views.results.renderTimeoutError(error);
        break;
      case VALIDATION_ERROR:
        this.views.search.handleValidationError(error);
        break;
      default: {
        const date = getFormattedDate();
        this.views.results.renderGenericError(date);
      }
    }
  };

  #controlUserInput = async data => {
    try {
      const formattedInput = formatInput(data);
      if (!formattedInput.length) throw new ValidationError();
      this.views.results.renderSpinner();
      await this.model.handleQuery({
        type: NEW_QUERY,
        payload: formattedInput,
      });
    } catch (error) {
      this.#errorHandler(error);
    }
  };

  #controlQueryResult = data => {
    const { word, phonetic, phonetics, sourceUrls } = data[0];
    const meanings = this.#formatMeaningsArrays(data[0]);
    pubSub.publish('currentQuery', {
      word,
      phonetic,
      phonetics,
      sourceUrls,
      meanings,
    });
  };

  #formatMeaningsArrays = data =>
    data.meanings.map(meaning => {
      switch (meaning.partOfSpeech) {
        case 'verb':
          return {
            ...meaning,
            definitions: meaning.definitions.slice(0, 1),
            synonyms: meaning.synonyms.slice(0, 3),
          };
        default:
          return {
            ...meaning,
            definitions: meaning.definitions.slice(0, 3),
            synonyms: meaning.synonyms.slice(0, 3),
          };
      }
    });

  #getState = () => {
    const state = this.model.getState({
      type: LOAD_STATE,
    });
    pubSub.publish('latestQueries', [...state.queries]);
    pubSub.publish('currentFont', state.currentFont);
    return state;
  };

  init() {
    this.#getState();
    pubSub.subscribe('userInput', this.#controlUserInput);
    pubSub.subscribe('queryResult', this.#controlQueryResult);
  }
}
