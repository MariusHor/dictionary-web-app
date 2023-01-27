import { formatInput } from './utils/util.helpers';
import pubSub from './utils/util.pubSub';
import { NetworkError, ValidationError } from './customErrors';

export default class Presenter {
  constructor(model) {
    this.model = model;
  }

  controlUserInput = async data => {
    try {
      const formattedData = formatInput(data);
      if (!formattedData.length) throw new ValidationError();
      pubSub.publish('renderSpinner');
      await this.model.handleQuery(formattedData);
    } catch (error) {
      if (error instanceof ValidationError) pubSub.publish('validationError', error);
      if (error instanceof NetworkError) pubSub.publish('networkError', error);
    }
  };

  controlQueryResult = data => {
    const { word, phonetic, phonetics, meanings, sourceUrls } = data[0];
    pubSub.publish('formattedQuery', {
      word,
      phonetic,
      phonetics,
      meanings,
      sourceUrls,
    });
  };

  init() {
    pubSub.subscribe('userInput', this.controlUserInput);
    pubSub.subscribe('queryResult', this.controlQueryResult);
  }
}
