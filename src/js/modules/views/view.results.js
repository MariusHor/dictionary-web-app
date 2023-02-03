import View from './view';
import { $el } from '../utils/util.helpers';
import pubSub from '../utils/util.pubSub';

class Results extends View {
  constructor() {
    super();
    this.parentEl = $el('.query-result');
    this.#handleSynonymsClick();
    this.#handlePlayAudio();
    pubSub.subscribe('currentQuery', this.#updateView);
  }

  #generateMarkup(data) {
    return `
    <div class="d-flex align-items-center justify-content-sm-between justify-content-center w-100 flex-wrap gap-4">
        <div class="query-result__title">
            <h1 class="query-result__word">${data.word}</h1>
            <p class="query-result__phonetic-text">${data.phonetic ?? ''}</p>
        </div>
        <button data-audio="button" class="audio-btn" ${!this.#checkAudio(data) ? 'disabled' : ''}>
          <audio data-audio="play">
            ${data.phonetics.map(
              phonetic => `
              <source src="${phonetic.audio}" type="audio/mpeg">
              `,
            )}
          </audio>
        </button>
    </div>
    <div class="d-flex flex-column gap-5 mt-6 query-result__types">
        ${this.#generateResultMarkup(data.meanings)}
    </div>`;
  }

  #checkAudio = data => data.phonetics.find(element => element.audio.length);

  #generateResultMarkup(meanings) {
    return meanings
      .map(
        meaning => `
            <div class="d-flex flex-column gap-4">
              <div class="row query-result__type">
                <h2>${meaning.partOfSpeech}</h2>
              </div>
              <div class="col query-result__meaning">
                  <h4>Meanings</h4>
                  <ul class="d-flex flex-column gap-3">
                      ${meaning.definitions
                        .map(definition => `<li>${definition.definition}</li>`)
                        .join('')}
                  </ul>
                  ${
                    meaning.partOfSpeech === 'verb' && meaning.definitions[0].example
                      ? `<p class="mt-3">"${meaning.definitions[0].example}"</p>`
                      : ''
                  }
              </div>
              ${meaning.synonyms.length ? this.#generateSynonymsMarkup(meaning.synonyms) : ''}
            </div>
              `,
      )
      .join('');
  }

  #generateSynonymsMarkup(synonyms) {
    return `            
          <div class="col query-result__synonyms d-flex flex-row gap-4">
              <h4>Synonyms</h4>
              <ul class="d-flex flex-wrap">
                  ${synonyms
                    .map(
                      synonym => `
                    <li>
                      <button data-synonym="${synonym}">
                        ${synonym}
                      </button>
                    </li>
                  `,
                    )
                    .join(' ')}
              </ul>
          </div>`;
  }

  #updateView = data => {
    this.clear();
    this.parentEl.insertAdjacentHTML('afterBegin', this.#generateMarkup(data));
  };

  #handleSynonymsClick = () => {
    this.parentEl.addEventListener('click', event => {
      const element = event.target.closest('[data-synonym]');
      if (!element) return;
      const { synonym } = element.dataset;
      pubSub.publish('userInput', synonym);
    });
  };

  #handlePlayAudio = () => {
    this.parentEl.addEventListener('click', event => {
      const element = event.target.closest('[data-audio="button"]');
      if (!element) return;
      const audioEl = $el('[data-audio="play"]');
      audioEl.volume = 0.5;
      audioEl.play();
    });
  };
}
export default new Results();
