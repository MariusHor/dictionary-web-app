import View from './view';
import { $el } from '../utils/util.helpers';
import pubSub from '../utils/util.pubSub';
import playIcon from '../../../assets/icon-play.svg';

class ResultsView extends View {
  constructor() {
    super();
    this.parentEl = $el('.query-result');
    pubSub.subscribe('networkError', this.handleError);
    pubSub.subscribe('formattedQuery', this.updateView);
    pubSub.subscribe('renderSpinner', this.renderSpinner);
  }

  generateMarkup(data) {
    return `
    <div class="row">
        <div class="col">
            <h1 class="query-result__word">${data.word}</h1>
            <p class="query-result__phonetic-text">${data.phonetic}</p>
        </div>
        <div class="col d-flex justify-content-end query-result__phonetic-audio">
            <img src="${playIcon}" alt="" />
        </div>
    </div>
    <div class="col">
        ${this.generateMeaningsMarkup(data.meanings)}
    </div>`;
  }

  generateMeaningsMarkup(meanings) {
    return meanings
      .map(
        meaning => `
              <h2 class="row query-result__type">${meaning.partOfSpeech}</h2>
              <div class="row query-result__meaning">
                  <h4>Meanings</h4>
                  <ul>
                      ${meaning.definitions
                        .map(definition => `<li>${definition.definition}</li>`)
                        .join('')}
                  </ul>
              </div>
              ${meaning.synonyms.length ? this.generateSynonymsMarkup(meaning.synonyms) : ''}
              `,
      )
      .join('');
  }

  generateSynonymsMarkup(synonyms) {
    return `            
          <div class="query-result__synonyms d-flex flex-row">
              <h4>Synonyms</h4>
              <ul class="d-flex">
                  ${synonyms.map(synonym => `<li>${synonym}</li>`).join(' ')}
              </ul>
          </div>`;
  }

  updateView = data => {
    this.clear();
    this.parentEl.insertAdjacentHTML('afterBegin', this.generateMarkup(data));
  };
}
export default new ResultsView();
